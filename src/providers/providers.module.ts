import { Module } from '@nestjs/common';
import { BrowserProvider } from './browser.provider';

@Module({
	providers: [BrowserProvider],
	exports: [BrowserProvider],
})
export class ProvidersModule {}

