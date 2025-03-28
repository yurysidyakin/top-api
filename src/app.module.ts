import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getJWTConfig } from './configs/jwt.config';
import { getMongoConfig } from './configs/mongo.config';
import { FilesModule } from './files/files.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TopPageModule } from './top-page/top-page.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
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
    FilesModule,
    SitemapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
