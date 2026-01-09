import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

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