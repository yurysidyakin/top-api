import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './models/post.module';
import { User, UserSchema } from './models/user.module';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
})
export class UsersModule {}
