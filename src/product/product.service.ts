import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewModel } from 'src/review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductDocument, ProductModel } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateByUd(id: string, dto: CreateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        { $match: { categories: dto.category } },
        {
          $sort: {
            _id: 1,
          },
        },
        { $limit: dto.limit },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
            pipeline: [{ $sort: { createdAt: -1 } }],
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            rating: { $avg: '$reviews.rating' },
            reviews: {
              $map: {
                input: '$reviews',
                as: 'review',
                in: {
                  _id: '$$review._id',
                  name: '$$review.name',
                  title: '$$review.title',
                  rating: '$$review.rating',
                  createdAt: '$$review.createdAt',
                },
              },
            },
          },
        },
      ])
      .exec() as Promise<
      (ProductModel & {
        reviews: ReviewModel[];
        reviewCount: number;
        reviewAvg: number;
        rating: number;
      })[]
    >;
  }
}
