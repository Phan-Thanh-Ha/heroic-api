import { Module } from '@nestjs/common';
import { ConfigENVPath, ConfigRegisterAs } from './app.configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { socketConfig } from '../socket';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			envFilePath: ConfigENVPath(),
			load: [
				ConfigRegisterAs(),
				socketConfig(),
			],
		}),
	],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class AppConfigModule {}
