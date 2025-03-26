import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

class ProductCharacteristicDto {
  name: string;
  value: string;
}

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema()
export class ProductModel {
  @Prop()
  image: string;
  @Prop()
  title: string;
  @Prop()
  price: number;
  @Prop()
  oldPrice?: number;
  @Prop()
  credit: number;
  @Prop()
  description: string;
  @Prop()
  advantages: string;
  @Prop()
  disAdvantages: string;
  @Prop()
  categories: string[];
  @Prop()
  tags: string[];
  @Prop()
  characteristics: ProductCharacteristicDto[];
}
export const ProductSchema = SchemaFactory.createForClass(ProductModel);
