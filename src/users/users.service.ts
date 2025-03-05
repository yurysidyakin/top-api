import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.module';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser({ email, password }: { email: string; password: string }) {
    const newUser = new this.userModel({ email, password });
    return newUser.save();
  }
}
