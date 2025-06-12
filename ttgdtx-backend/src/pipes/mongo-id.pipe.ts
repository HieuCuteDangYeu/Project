import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid MongoDB ID');
    }
    return new mongoose.Types.ObjectId(value);
  }
}
