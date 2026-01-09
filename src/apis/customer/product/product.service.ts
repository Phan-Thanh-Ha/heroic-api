import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async ApiGetProductBySlug(slug: string){
    // Mock implementation for demonstration purposes
    return this.productRepository.getProductBySlug(slug);
  }
}
