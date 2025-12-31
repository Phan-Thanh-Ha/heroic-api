import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
    private readonly logger = new Logger(DiscordService.name);
    private client: Client;

    constructor(private readonly prisma: PrismaService) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages, // Cần thiết để gửi tin nhắn riêng
            ],
        });
    }

    async onModuleInit() {
        const token = process.env.DISCORD_TOKEN;
        const clientId = process.env.DISCORD_APP_ID;
        const guildId = process.env.SEVER_DISCORD_ID;

        if (!token || !clientId || !guildId) {
            this.logger.error('Thiếu thông số cấu hình Discord trong .env');
            return;
        }

        // 1. Đăng ký lệnh /link với Discord
        await this.registerCommands(token, clientId, guildId);

        // 2. Đăng nhập Bot
        await this.client.login(token);

        // 3. Lắng nghe sự kiện người dùng gõ lệnh /link
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'link') {
                const email = interaction.options.getString('email');
                const discordId = interaction.user.id;

                try {
                    // Cập nhật discordId vào bảng Customer dựa trên email
                    await this.prisma.customer.update({
                        where: { email: email as string },
                        data: { 
                            discordId: discordId // Prisma sẽ tự hiểu và lưu vào cột "discord_id" trong DB cho bạn
                        },
                    });

                    this.logger.log(`✅ Đã liên kết: ${email} -> ${discordId}`);

                    await interaction.reply({
                        content: `✅ Liên kết thành công! Từ nay OTP cho tài khoản **${email}** sẽ được gửi trực tiếp vào tin nhắn riêng của bạn trên Discord.`,
                        ephemeral: true, // Chỉ người gõ lệnh mới thấy
                    });
                } catch (error) {
                    this.logger.error(`Lỗi liên kết: ${error.message}`);
                    await interaction.reply({
                        content: `❌ Lỗi: Không tìm thấy khách hàng có email **${email}** trong hệ thống. Vui lòng kiểm tra lại email bạn đã đăng ký trên website.`,
                        ephemeral: true,
                    });
                }
            }
        });

        this.client.once('clientReady', (c) => {
            this.logger.log(`✅ Bot ${c.user.tag} đã sẵn sàng nhận lệnh!`);
        });
    }

    private async registerCommands(token: string, clientId: string, guildId: string) {
        const commands = [
            new SlashCommandBuilder()
                .setName('link')
                .setDescription('Liên kết email website với Discord để nhận mã OTP')
                .addStringOption(opt => 
                    opt.setName('email')
                       .setDescription('Email bạn sử dụng để đăng nhập website')
                       .setRequired(true)
                )
        ].map(c => c.toJSON());

        const rest = new REST({ version: '10' }).setToken(token);
        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            this.logger.log('🔥 Đã nạp lệnh /link vào Server!');
        } catch (e) {
            this.logger.error('Lỗi nạp lệnh', e);
        }
    }

    /**
     * Hàm gửi OTP qua tin nhắn riêng (Direct Message)
     * Gọi hàm này từ AuthController/Service khi người dùng nhấn Login
     */
    async sendDiscordOTP(discordId: string, otp: string) {
        try {
            const user = await this.client.users.fetch(discordId);
            await user.send(`🔐 Mã xác thực (OTP) của bạn là: **${otp}**. Mã này có hiệu lực trong 5 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.`);
            this.logger.log(`📨 Đã gửi OTP đến Discord ID: ${discordId}`);
            return true;
        } catch (error) {
            this.logger.error(`❌ Không thể gửi tin nhắn cho Discord ID ${discordId}: ${error.message}`);
            return false;
        }
    }
}