import { Module } from '@nestjs/common';
import { BrowserProvider, ValidationProvider } from './index';

@Module({
	providers: [BrowserProvider, ValidationProvider],
	exports: [BrowserProvider, ValidationProvider],
})
export class ProvidersModule {}

