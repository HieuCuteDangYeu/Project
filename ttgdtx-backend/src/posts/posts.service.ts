import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { BaseService } from '../common/base.service';

@Injectable()
export class PostsService extends BaseService<PostDocument> {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super(postModel);
  }

  protected async validateCreate(createDto: CreatePostDto): Promise<void> {
    const userExists = await this.userModel.findById(createDto.userId).exec();
    if (!userExists) {
      throw new NotFoundException(
        `User with ID ${createDto.userId.toString()} not found.`,
      );
    }
  }

  protected async validateUpdate(
    id: Types.ObjectId,
    updateDto: UpdatePostDto,
  ): Promise<void> {
    if (updateDto.userId) {
      const userExists = await this.userModel.findById(updateDto.userId).exec();
      if (!userExists) {
        throw new NotFoundException(
          `User with ID ${updateDto.userId.toString()} not found.`,
        );
      }
    }
  }
}
