import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const userExists = await this.userModel
      .findById(createPostDto.userId)
      .exec();

    if (!userExists) {
      throw new NotFoundException(
        `User with ID ${createPostDto.userId.toString()} not found.`,
      );
    }

    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(options: PaginationOptions): Promise<PaginatedPosts> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.postModel.find().skip(skip).limit(limit).exec(),
      this.postModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts: results,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id.toString()}" not found.`);
    }
    return post;
  }

  async update(
    id: mongoose.Types.ObjectId,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const existingPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!existingPost) {
      throw new NotFoundException(`Post with ID "${id.toString()}" not found.`);
    }
    return existingPost;
  }

  async remove(id: mongoose.Types.ObjectId): Promise<any> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Post with ID "${id.toString()}" not found.`);
    }
    return { message: `Post with ID "${id.toString()}" successfully removed.` };
  }
}
