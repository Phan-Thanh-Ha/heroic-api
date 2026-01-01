import { JwtPayloadAdmin } from "@jwt";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { generateUUID } from "@utils";
import { QueryUserDto } from "../employees/dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { categoryErrorTypes } from "src/common/code-type/category/category-error.code-type";
@Injectable()
export class CategoryRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { 
    }

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

    //Lấy danh sách danh mục
    async getListCategory(query: QueryUserDto) {
        const { page, limit } = query;
        const category = await this.prisma.category.findMany({
            where: {
                isDeleted: false,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return {
            items: category,
            total: category.length,
        };
    }
    
    // Cập nhật danh mục
    async updateCategory(updateCategoryDto: UpdateCategoryDto, userInfo: JwtPayloadAdmin) {
        const {  uuid, ...data } = updateCategoryDto;
        const { id: userId } = userInfo;
        return await this.prisma.category.update({
            where: { id: updateCategoryDto.id },
            data: {
                name: data.name,
                slug: data.slug,
                banner: data.banner,
                thumbnail: data.thumbnail,
                description: data.description,
                updatedById: userId,
                updatedAt: new Date(),
            },
            include: {
                products: true,
            },
        });
    }

    // Mở đóng danh mục
    async toggleActiveCategory(uuid: string, user: JwtPayloadAdmin) {
        const { id: userId } = user;
        // 1. Kiểm tra danh mục có tồn tại không
        const category = await this.prisma.category.findUnique({
            where: { uuid },
        });
    
        if (!category) {
            throw new BadRequestException(categoryErrorTypes().CATEGORY_GET_LIST_FAILED);
        }
    
        // 2. Đảo ngược trạng thái: nếu true -> false, nếu false -> true
        const updatedCategory = await this.prisma.category.update({
            where: { uuid },
            data: { 
                isActive: !category.isActive, // Dấu ! sẽ tự động đảo giá trị boolean
                updatedById: userId,
                updatedAt: new Date(),
            },
        });
    
        return updatedCategory;
    }

    // Xóa danh mục
    async deleteCategory(uuid: string, user: JwtPayloadAdmin) {
        const { id: userId } = user;
        return await this.prisma.category.update({
            where: { uuid },
            data: {
                isDeleted: true,
                updatedById: userId,
                updatedAt: new Date(),
            },
        });
    }

}