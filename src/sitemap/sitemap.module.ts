import { Module } from '@nestjs/common';
import { TopPageModule } from 'src/top-page/top-page.module';
import { SitemapController } from './sitemap.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SitemapController],
  imports: [TopPageModule, ConfigModule],
})
export class SitemapModule {}
