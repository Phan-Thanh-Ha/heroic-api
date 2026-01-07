import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoggerService } from "@logger";

@Injectable()
export class CategoryRepository {
    private context = CategoryRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {}

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
                            // Lấy ảnh để làm thumbnail
                            productImages: {
                                take: 1, 
                                select: { image: true }
                            },
                            // Lấy giá để tính Min Price
                            productDetails: {
                                select: { 
                                    retailPrice: true,
                                    discount: true 
                                }
                            }
                        }
                    },
                },
                orderBy: {
                    id: 'asc',
                }
            });

            // Format lại dữ liệu trước khi trả về
            const formattedData = categoryList.map(category => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                banner: category.banner,
                thumbnail: category.thumbnail,
                description: category.description,
                products: category.products.map(product => {
                    // Tính giá thấp nhất sau khi trừ chiết khấu (nếu có)
                    const minPrice = product.productDetails.length > 0
                        ? Math.min(...product.productDetails.map(d => {
                            const discountPrice = d.retailPrice - (d.retailPrice * (d.discount || 0) / 100);
                            return discountPrice;
                        }))
                        : 0;

                    return {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        image: product.productImages[0]?.image || null,
                        minPrice: minPrice,
                        // Có thể thêm nhãn Brand nếu cần
                    };
                })
            }));

            return {
                items: formattedData,
                total: formattedData.length,
            };
        } catch (error) {
            this.logger.error(this.context, 'getCategoryList', error);
            throw error;
        }
    }
}