import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rename } from 'fs';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { File } from './entities/file.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) { }

  async create(createPostDto: CreatePostDto) {
    const post = new Post();
    post.title = createPostDto.title;
    post.subtitle = createPostDto.subtitle;
    post.body = createPostDto.body;
    post.files = [];
    post.categories = [];


    for (const categoryId of createPostDto.categories) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId })
      if (category !== null)
        post.categories.push(category)
    }

    const postRes = await this.postRepository.save(post)

    const promiseList = []
    for (const fileName of createPostDto.files) {
      const file = new File()
      file.name = fileName
      file.post = postRes
      promiseList.push(this.fileRepository.save(file))
    }

    rename('post_files/temp', `post_files/${postRes.id}`, function (err) {
      if (err) {
        console.log(err)
      }
    })

    const values = await Promise.all(promiseList)

    const fileRes = []
    values.forEach((value) => {
      fileRes.push(value.id)
    })

    return { postRes: postRes, fileRes: fileRes };
  }

  findAll() {
    return this.postRepository.find(
      {
        loadRelationIds: true
      }
    );
  }

  findOne(id: number) {
    return this.postRepository.findOneBy({ id });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const post = new Post();
    post.title = updatePostDto.title;
    post.subtitle = updatePostDto.subtitle;
    post.body = updatePostDto.body;
    post.categories = []
    return this.postRepository.update(id, post);
  }

  remove(id: number) {
    return this.postRepository.delete({ id });
  }
}
