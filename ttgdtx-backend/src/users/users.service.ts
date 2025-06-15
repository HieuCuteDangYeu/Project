import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/common/base.service';
import { UserDocument, User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  protected async validateUpdate(
    id: Types.ObjectId,
    updateDto: UpdateUserDto,
  ): Promise<void> {
    if (updateDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateDto.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }
  }
}
