import { LoggerService } from "@logger";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { generateUUID } from "@utils";
import { JwtPayloadAdmin } from "@jwt";
import { QueryUserDto } from "../employees/dto";
import { getMetadata } from "@common";

@Injectable()
export class CategoryRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) { }

    //#region Tạo danh mục mới
    async createCategory(createCategoryDto: CreateCategoryDto, userInfo: JwtPayloadAdmin) {
        return await this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                slug: createCategoryDto.slug,
                banner: createCategoryDto.banner,
                thumbnail: createCategoryDto.thumbnail,
                description: createCategoryDto.description,
                isActive: true,
                uuid: generateUUID(),
                createdById: userInfo.id,
            },
        });
    }
    //#endregion

    //#region Lấy danh sách danh mục
    async getListCategory(query: QueryUserDto) {
        const { page, limit } = query;
        const category = await this.prisma.category.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                id: 'desc',
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });

        return {
            items: category,
            total: category.length,
        };
    }
    
    //#endregion
}