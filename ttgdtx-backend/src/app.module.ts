import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('email.host'),
          auth: {
            user: config.get<string>('email.username'),
            pass: config.get<string>('email.password'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    RolesModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
