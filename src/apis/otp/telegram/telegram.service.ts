import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;

  constructor(private prisma: PrismaService) {
    // Khởi tạo bot với Token từ file .env
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);
  }

  async onModuleInit() {
    this.logger.log('📢 Đang khởi động Telegram Bot...');

    // 1. Lệnh /start để hướng dẫn người dùng
    this.bot.start((ctx) => {
      return ctx.reply('🚀 Chào mừng tới Heroic Gym! Hãy gõ: /link <email> để nhận OTP.');
    });

    // 2. Lệnh /link để liên kết tài khoản (Đã chạy thành công trong ảnh của bạn)
    this.bot.command('link', async (ctx) => {
      const email = ctx.message.text.split(' ')[1];
      const telegramId = ctx.from.id.toString();

      if (!email) {
        return ctx.reply('⚠️ Cú pháp sai! Hãy gõ: /link email_cua_ban@gmail.com');
      }

      try {
        await this.prisma.customer.update({
          where: { email: email.trim() },
          data: { telegramId: telegramId },
        });
        return ctx.reply(`✅ Thành công! Đã liên kết với ${email}`);
      } catch (e) {
        this.logger.error(`Lỗi link Telegram: ${e.message}`);
        return ctx.reply('❌ Email không tồn tại hoặc đã được liên kết với ID khác.');
      }
    });

    // 3. Khởi chạy Bot (Không dùng await để tránh treo NestJS)
    this.bot.launch()
      .then(() => {
        this.logger.log('🚀 [XÁC NHẬN] TELEGRAM BOT ĐÃ ONLINE!');
      })
      .catch((err) => {
        this.logger.error('❌ LỖI KẾT NỐI TELEGRAM (MẠNG YẾU):', err.message);
      });
  }

  // Tắt bot an toàn khi ứng dụng dừng
  onModuleDestroy() {
    this.bot.stop('SIGINT');
  }

  /**
   * Hàm gửi OTP - Bạn sẽ gọi hàm này từ Controller khi người dùng nhấn Login
   */
  async sendTelegramOTP(telegramId: string, otp: string): Promise<boolean> {
    try {
      await this.bot.telegram.sendMessage(
        telegramId, 
        `🔐 Mã xác thực (OTP) của bạn là: **${otp}**\nMã có hiệu lực trong 5 phút.`,
        { parse_mode: 'Markdown' } // Để in đậm số OTP
      );
      this.logger.log(`📨 Đã gửi OTP thành công tới Telegram ID: ${telegramId}`);
      return true;
    } catch (e) {
      this.logger.error(`❌ Lỗi gửi tin nhắn OTP: ${e.message}`);
      return false;
    }
  }
}