import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewDocument } from './models/review.model';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    this.logger.log('Запрос на создание отзыва:', JSON.stringify(dto));
    try {
      const createdReview = await this.reviewService.create(dto);
      this.logger.log('Отзыв успешно создан:', JSON.stringify(createdReview));
      return createdReview;
    } catch (error) {
      this.logger.error('Ошибка при создании отзыва:', error.message);
      throw new HttpException(
        'Ошибка при создании отзыва',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    this.logger.log('Запрос на удаление отзыва с ID:', id);
    try {
      const deletedDoc = await this.reviewService.delete(id);
      if (!deletedDoc) {
        this.logger.warn('Отзыв не найден:', id);
        throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      this.logger.log('Отзыв успешно удалён:', JSON.stringify(deletedDoc));
      return deletedDoc;
    } catch (error) {
      this.logger.error('Ошибка при удалении отзыва:', error.message);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string,
  ): Promise<ReviewDocument[]> {
    this.logger.log(
      `Запрос на получение отзывов для продукта с ID: ${productId}, от пользователя: ${email}`,
    );
    try {
      const reviews = await this.reviewService.findByProductId(productId);
      this.logger.log(
        `Найдено ${reviews.length} отзывов для продукта с ID: ${productId}`,
      );
      return reviews;
    } catch (error) {
      this.logger.error(
        'Ошибка при получении отзывов для продукта:',
        error.message,
      );
      throw new HttpException(
        'Ошибка при получении отзывов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
