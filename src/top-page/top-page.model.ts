import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopPageDocument = HydratedDocument<TopPageModel>;

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class HhData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;

  @Prop()
  updatedAt: Date;
}

export class TopPageAdvantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema({ timestamps: true })
export class TopPageModel {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({ type: () => HhData })
  hh?: HhData;

  @Prop({ type: () => [TopPageAdvantage] })
  advantages?: TopPageAdvantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop({ type: () => [String] })
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);

TopPageSchema.index({ '$**': 'text' });
