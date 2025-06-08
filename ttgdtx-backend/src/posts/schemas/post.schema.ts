import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  category: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: Types.ObjectId; // Reference to the User model
}

export const PostSchema = SchemaFactory.createForClass(Post);
