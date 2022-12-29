import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
// import { Category } from './posts/entities/category.entity';
// import { Post } from './posts/entities/post.entity';
// import { File } from './posts/entities/file.entity';
import { PostsModule } from './posts/posts.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.development.env' : '.production.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.host,
      port: parseInt(process.env.port),
      username: process.env.username,
      password: process.env.password,
      database: process.env.database,
      // entities: [Post, Category, File],
      autoLoadEntities: true,
      synchronize: false,
    }),
    PostsModule,
    FileModule
  ],
})

export class AppModule {
}
