import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getProducts(query: any) {
        const { page = 1, limit = 10, name, category } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            isActive: true,
            isDeleted: false,
        };

        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            };
        }

        if (category) {
            const categories = Array.isArray(category) ? category : [category];
            where.category = {
                slug: {
                    in: categories
                }
            }
        }

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: Number(skip),
                take: Number(limit),
                include: {
                    productDetails: true,
                    productImages: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getProductBySlug(slug: string) {
        return await this.prisma.product.findUnique({
            where: {
                slug,
            },
            include: {
                productDetails: true, // Join với bảng chi tiết
                productImages: true,  // Join với bảng hình ảnh
            },
        });
    }
}