import { Module } from '@nestjs/common';
import { UploadModule } from '../upload';
import { ApiAdminModule } from './admin';
import { ApiCustomerModule } from './customer';
import { EmailModule } from './otp/email/email.module';
import { DiscordModule } from './otp/discord/discord.module';

@Module({
	imports: [
		ApiCustomerModule,
		ApiAdminModule,
		UploadModule,
		EmailModule,
		DiscordModule, // Upload module dùng chung cho cả customer và admin
	],
})

export class ApiModule {}