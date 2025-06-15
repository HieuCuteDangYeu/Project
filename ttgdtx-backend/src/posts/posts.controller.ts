import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import mongoose from 'mongoose';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Permissions([{ resource: Resource.posts, actions: [Action.create] }])
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @Permissions([{ resource: Resource.posts, actions: [Action.read] }])
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    return this.postsService.findAll({ page, limit });
  }

  @Get(':id')
  @Permissions([{ resource: Resource.posts, actions: [Action.read] }])
  findOne(@Param('id', MongoIdPipe) id: mongoose.Types.ObjectId) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.posts, actions: [Action.update] }])
  update(
    @Param('id', MongoIdPipe) id: mongoose.Types.ObjectId,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Permissions([{ resource: Resource.posts, actions: [Action.delete] }])
  remove(@Param('id', MongoIdPipe) id: mongoose.Types.ObjectId) {
    return this.postsService.remove(id);
  }
}
