import { LoggerService } from "@logger";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";

@Injectable()
export class CategoryRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) { }
}