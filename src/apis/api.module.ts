import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';

@Module({
	imports: [
		ProvinceModule,
		DistrictsModule,
		WardsModule,
	],
})

export class ApiModule {}