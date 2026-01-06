import { PrismaService } from "@prisma";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtPayloadAdmin } from "@jwt";
import { generateUUID } from "@utils";
import { productErrorTypes } from "@common";
import { LoggerService } from "@logger";
import { QueryProductDto } from "./dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) { }

    /**
     * Tạo sản phẩm kèm danh sách ảnh
     */
    async createProduct(createProductDto: CreateProductDto, user: JwtPayloadAdmin) {
        try {
            const product = await this.prisma.product.create({
                data: {
                    uuid: generateUUID(),
                    code: createProductDto.code,
                    name: createProductDto.name,
                    description: createProductDto.description,
                    slug: createProductDto.slug,
                    importPrice: createProductDto.importPrice,
                    retailPrice: createProductDto.retailPrice,
                    categoryId: createProductDto.categoryId,
                    isActive: true,
                    createdById: user.id,
                    // Lưu ảnh đầu tiên làm ảnh đại diện chính
                    image: createProductDto.images?.[0] || null,

                    // Tạo các bản ghi trong bảng ProductImage
                    productImages: {
                        create: createProductDto.images?.map((img) => ({
                            image: img,
                        })) || [],
                    },
                },
                include: {
                    productImages: true,
                }
            });
            return product;
        } catch (error) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_CREATE_FAILED.message.vi);
        }
    }

    /**
     * Cập nhật sản phẩm và đồng bộ lại danh sách ảnh
     */
    async updateProduct(productId: number, updateProductDto: UpdateProductDto, user: JwtPayloadAdmin) {
        try {
            return await this.prisma.product.update({
                where: { id: productId },
                data: {
                    name: updateProductDto.name,
                    description: updateProductDto.description,
                    slug: updateProductDto.slug,
                    importPrice: updateProductDto.importPrice,
                    retailPrice: updateProductDto.retailPrice,
                    categoryId: updateProductDto.categoryId,
                    updatedById: user.id,
                    updatedAt: new Date(),
                    // Cập nhật ảnh đại diện mới
                    image: updateProductDto.images?.[0],

                    // Cập nhật chi tiết sản phẩm
                    productDetails: {
                        updateMany: {
                            where: { productId: productId },
                            data: {
                                sku: updateProductDto.code,
                                importPrice: updateProductDto.importPrice,
                                retailPrice: updateProductDto.retailPrice,
                                quantity: updateProductDto.quantity,
                            },
                        },
                    },

                    productImages: {
                        // Xóa toàn bộ ảnh cũ của sản phẩm này
                        deleteMany: {}, 
                        // Chèn lại danh sách ảnh mới từ DTO
                        updateMany: updateProductDto.images?.map((img) => ({
                            where: { productId: productId },
                            data: { image: img },
                        })),
                    },
                },
                include: {
                    productImages: true,
                }
            });
        } catch (error) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_UPDATE_FAILED.message.vi);
        }
    }

    /**
     * Lấy danh sách sản phẩm có phân trang
     */
    async getListProduct(query: QueryProductDto) {
        const { limit = 10, page = 1 } = query;
        try {
            // Lấy tổng số lượng để làm phân trang
            const total = await this.prisma.product.count({
                where: { isDeleted: false }
            });

            const products = await this.prisma.product.findMany({
                where: {
                    isDeleted: false,
                },
                orderBy: {
                    id: 'desc',
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    productImages: true, // Lấy kèm danh sách ảnh
                },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            });

            const productsWithCategory = products.map((product) => {
                const { category, ...rest } = product;
                return {
                    ...rest,
                    categoryName: category?.name || null,
                };
            });

            return {
                items: productsWithCategory,
                total: total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            };
        } catch (error) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_GET_LIST_FAILED.message.vi);
        }
    }
}