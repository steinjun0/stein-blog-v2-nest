import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity'
import { Category } from './entities/category.entity';
import { File } from './entities/file.entity'
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Post, Category, File]
    )
  ],
  controllers: [CategoryController, PostsController],
  providers: [PostsService, CategoryService],
})
export class PostsModule { }
