import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  password: string; // Store hashed password

  @Prop({ required: false, type: SchemaTypes.ObjectId })
  roleId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
