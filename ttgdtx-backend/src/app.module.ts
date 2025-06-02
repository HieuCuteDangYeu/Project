import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { PostsService } from './posts/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_URI || 'mongodb://localhost:27017',
    ),
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [PostsService],
})
export class AppModule {}
