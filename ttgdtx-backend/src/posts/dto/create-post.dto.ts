import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;
}
