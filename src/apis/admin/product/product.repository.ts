import { PrismaService } from "@prisma";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtPayloadAdmin } from "@jwt";
import { productErrorTypes,generateUUID } from "@common";
import { LoggerService } from "@logger";
import { QueryProductDto } from "./dto/query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) { }

    async createProduct(createProductDto: CreateProductDto, user: JwtPayloadAdmin) {
        try {
            return await this.prisma.product.create({
                data: {
                    uuid: generateUUID(),
                    code: createProductDto.productCode,
                    name: createProductDto.name,
                    description: createProductDto.description,
                    slug: createProductDto.slug,
                    brandId: createProductDto.brandId,

                    originId: createProductDto.originId,
                    categoryId: createProductDto.categoryId,
                    isActive: true,
                    createdById: user.id,
                    // Lấy ảnh đầu tiên trong danh sách làm ảnh chính của sản phẩm
                    image: createProductDto.productImages?.[0]?.image || null,

                    // Lưu danh sách hình ảnh chi tiết
                    productImages: {
                        create: createProductDto.productImages?.map((img) => ({
                            image: img.image,
                        })) || [],
                    },

                    // Lưu danh sách biến thể (vị, size, giá)
                    productDetails: {
                        create: createProductDto.productDetails?.map((detail) => ({
                            sku: detail.sku,
                            flavor: detail.flavor,
                            size: detail.size,
                            importPrice: detail.importPrice,
                            retailPrice: detail.retailPrice,
                            discount: detail.discount,
                            quantity: detail.stock, // FIX: Map 'stock' từ DTO sang 'quantity' của Prisma
                        })) || [],
                    },
                },
                include: {
                    productImages: true,
                    productDetails: true,
                }
            });
        } catch (error: any) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_CREATE_FAILED.message.vi);
        }
    }

    /**
     * Cập nhật sản phẩm: Đồng bộ lại toàn bộ Detail và Image bằng cách Xóa cũ - Tạo mới
     */
    async updateProduct(productId: number, updateProductDto: UpdateProductDto, user: JwtPayloadAdmin) {
        try {
            return await this.prisma.product.update({
                where: { id: productId },
                data: {
                    name: updateProductDto.name,
                    code: updateProductDto.productCode,
                    description: updateProductDto.description,
                    slug: updateProductDto.slug,
                    brandId: updateProductDto.brandId,
                    // FIX: Sử dụng originId để khớp với Prisma Schema
                    originId: updateProductDto.originId,
                    categoryId: updateProductDto.categoryId,
                    updatedById: user.id,
                    updatedAt: new Date(),

                    // Cập nhật lại ảnh đại diện chính
                    image: updateProductDto.productImages?.[0]?.image,

                    // Đồng bộ Hình ảnh: Xóa toàn bộ ảnh cũ và thêm loạt ảnh mới
                    productImages: {
                        deleteMany: {},
                        create: updateProductDto.productImages?.map((img) => ({
                            image: img.image,
                        })) || [],
                    },

                    // Đồng bộ Biến thể: Xóa toàn bộ biến thể cũ và tạo mới theo DTO
                    productDetails: {
                        deleteMany: {},
                        create: updateProductDto.productDetails?.map((detail) => ({
                            sku: detail.sku,
                            flavor: detail.flavor,
                            size: detail.size,
                            importPrice: detail.importPrice,
                            retailPrice: detail.retailPrice,
                            discount: detail.discount,
                            quantity: detail.stock, // FIX: 'stock' -> 'quantity'
                        })) || [],
                    },
                },
                include: {
                    productImages: true,
                    productDetails: true,
                }
            });
        } catch (error: any) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_UPDATE_FAILED.message.vi);
        }
    }

    /**
     * Lấy danh sách sản phẩm: Tính toán giá thấp nhất và tổng tồn kho
     */
    async getListProduct(query: QueryProductDto) {
        const { limit = 10, page = 1 } = query;
        try {
            const total = await this.prisma.product.count({
                where: { isDeleted: false }
            });

            const products = await this.prisma.product.findMany({
                where: { isDeleted: false },
                orderBy: { id: 'desc' },
                include: {
                    category: { select: { name: true } },
                    productImages: true,
                    productDetails: {
                        // FIX: Select trường 'quantity' thay vì 'stock'
                        select: { retailPrice: true, discount: true, quantity: true }
                    },
                },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            });

            // Format dữ liệu trả về cho giao diện Admin
            const formattedProducts = products.map((product: any) => {
                const { category, productDetails, ...rest } = product;

                // Logic lấy giá bán thấp nhất của sản phẩm
                const minPrice = productDetails && productDetails.length > 0
                    ? Math.min(...productDetails.map((d: any) => d.retailPrice))
                    : 0;

                // Logic tính tổng lượng hàng trong kho của tất cả biến thể
                const totalStock = productDetails
                    ? productDetails.reduce((sum: number, d: any) => sum + d.quantity, 0)
                    : 0;

                return {
                    ...rest,
                    categoryName: category?.name || null,
                    minPrice: minPrice,
                    totalStock: totalStock,
                };
            });

            return {
                items: formattedProducts,
                total: total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            };
        } catch (error: any) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_GET_LIST_FAILED.message.vi);
        }
    }
}