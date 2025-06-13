import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findAll(options: PaginationOptions): Promise<PaginatedUsers> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: results,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error(`User with ID ${id.toString()} not found.`);
    }
    return user;
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id.toString()}" not found.`);
    }
    return existingUser;
  }

  async remove(id: Types.ObjectId): Promise<any> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID "${id.toString()}" not found.`);
    }
    return { message: `User with ID "${id.toString()}" successfully removed.` };
  }
}
