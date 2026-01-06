import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoggerService } from "@logger";

@Injectable()
export class CategoryRepository {
    private context = CategoryRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {
    }

    /**
     * Lấy danh sách danh mục
     * @returns Danh sách danh mục và số lượng sản phẩm của danh mục đó
     */
    async getCategoryList() {
        try {
            // Lấy danh sách danh mục và 5 item product của danh mục đó
            const categoryList = await this.prisma.category.findMany({
                where: {
                    isActive: true,
                },
                include: {
                    products: {
                        take: 5,
                    },
                },
                orderBy:{
                    id: 'asc',
                }
            });
            return {
                items: categoryList,
                total: categoryList.length,
            };
        } catch (error) {
            this.logger.error(this.context, 'getCategoryList', error);
            throw error;
        }
    }
}