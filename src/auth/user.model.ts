import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  email: string;
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
