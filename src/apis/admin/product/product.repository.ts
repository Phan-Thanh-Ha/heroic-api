import { PrismaService } from "@prisma";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtPayloadAdmin } from "@jwt";
import { generateUUID } from "@utils";
import { productErrorTypes } from "@common";
import { LoggerService } from "@logger";
import { QueryProductDto } from "./dto";

@Injectable()
export class ProductRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) {}

    /**
     * Tạo sản phẩm
     * @param createProductDto - Thông tin sản phẩm
     * @param user - Thông tin người dùng
     * @returns 
     */
    async createProduct(createProductDto: CreateProductDto, user: JwtPayloadAdmin){
        
        try {
            const product = await this.prisma.product.create({
                data: {
                    uuid: generateUUID(),
                    code: createProductDto.code,
                    name: createProductDto.name,
                    description: createProductDto.description,
                    image: createProductDto.image,
                    slug: createProductDto.slug,
                    importPrice: createProductDto.importPrice,
                    retailPrice: createProductDto.retailPrice,
                    categoryId: createProductDto.categoryId,
                    isActive: true,
                    createdById: user.id,
                },
            });
            return product;
        } catch (error) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_CREATE_FAILED.message.vi);
        }
    }

    /**
     * Lấy danh sách sản phẩm
     * @param query - Thông tin tìm kiếm
     * @returns 
     */
    async getListProduct(query: QueryProductDto) {
        const {limit, page} = query;
        try {
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
                },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            });
            const productsWithCategory = products.map((product) => {
                const { category, ...rest } = product;
                return {
                    ...rest,
                    categoryName: category.name,
                };
            });
            return {
                items: productsWithCategory,
                total: productsWithCategory.length,
            };
        } catch (error) {
            this.loggerService.error(ProductRepository.name, error.message, error.stack);
            throw new BadRequestException(productErrorTypes().PRODUCT_GET_LIST_FAILED.message);
        }
    }
}