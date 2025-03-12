import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { TopPageModule } from './top-page/top-page.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TopPageModule,
    ProductModule,
    ReviewModule,
    // MongooseModule.forRoot('mongodb://localhost:27017/mongo'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
