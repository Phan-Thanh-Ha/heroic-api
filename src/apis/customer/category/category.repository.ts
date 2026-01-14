import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoggerService } from "@logger";

@Injectable()
export class CategoryRepository {
    private context = CategoryRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) { }

    // Lấy danh sách danh mục kèm sản phẩm mẫu
    async getCategoryList() {
        try {
            const categoryList = await this.prisma.category.findMany({
                where: {
                    isActive: true,
                    isDeleted: false, // Đảm bảo không lấy danh mục đã xóa
                },
                include: {
                    products: {
                        where: {
                            isActive: true,
                            isDeleted: false,
                        },
                        take: 5,
                        orderBy: {
                            id: 'desc', // Lấy 5 sản phẩm mới nhất
                        },
                        include: {
                            // Lấy full thông tin bảng productImages
                            productImages: true,
                            // Lấy full thông tin bảng productDetails
                            productDetails: true,
                        }
                    },
                },
                orderBy: {
                    id: 'asc',
                }
            });

            const result = categoryList.map(category => ({
                ...category,
                products: category.products.map(product => ({
                    ...product,
                    productDetails: product.productDetails.map(detail => ({
                        ...detail,
                        // Thêm trường tính toán tại đây
                        discountedPrice: detail.discount && detail.discount > 0
                        // Công thức tính giá chiếc khấu là giá gốc trừ đi giá chiếc khấu
                            ? detail.retailPrice * (1 - detail.discount / 100)
                            : detail.retailPrice
                    }))
                }))
            }));

            return {
                items: result,
                total: result.length,
            };
        } catch (error) {
            this.logger.error(this.context, 'getCategoryList', error);
            throw error;
        }
    }
}