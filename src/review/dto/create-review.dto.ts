export class CreateReviewDto {
  name: string;
  title: string;
  description: string;
  rating: number;
  createdAt: Date;
  productId: string;
}
