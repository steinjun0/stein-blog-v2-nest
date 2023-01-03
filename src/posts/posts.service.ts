import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rename } from 'fs';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { File } from '../file/entities/file.entity';
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

  async updateCategories(categories: string[]) {
    for (const categoryName of categories) {
      const category = await this.categoryRepository.findOneBy({ name: categoryName })
      if (category === null) {
        const tempCategory = new Category()
        tempCategory.name = categoryName
        this.categoryRepository.save(tempCategory)
      }
    }
  }

  async updateFiles(post: Post, files: string[]) {
    for (const fileName of files) {
      const file = await this.fileRepository.findOneBy({ name: fileName })
      if (file === null) {
        const tempFile = new File()
        tempFile.name = fileName
        tempFile.post = post
        this.fileRepository.save(tempFile)
      }
    }
  }



  async create(createPostDto: CreatePostDto) {
    const post = new Post();
    post.title = createPostDto.title;
    post.subtitle = createPostDto.subtitle;
    post.body = createPostDto.body;
    post.files = [];
    post.categories = [];

    await this.updateCategories(createPostDto.categories)

    const postRes = await this.postRepository.save(post)
    this.postRepository.update(postRes.id, { body: post.body.replace(/file\/post\/temp/gi, `file/post/${postRes.id}`).replace('/\/\/localhost\:8888\/', 'https://api.blog.steinjun.net') })

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
        // loadRelationIds: true
        relations: ['categories', 'files'],
      }
    );
  }

  findOne(id: number) {
    return this.postRepository.findOne({ where: { id }, relations: ['categories', 'files'] });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    post.created_at = undefined
    post.updated_at = undefined
    post.title = updatePostDto.title;
    post.subtitle = updatePostDto.subtitle;
    post.body = updatePostDto.body;
    // post.files = [];
    // post.categories = []
    const promiseList: Promise<any>[] = []
    promiseList.push(this.updateCategories(updatePostDto.categories))
    promiseList.push(this.updateFiles(post, updatePostDto.files))
    post.body.replace(/file\/post\/temp/gi, `file/post/${id}`).replace('/\/\/localhost\:8888\/', 'https://api.blog.steinjun.net')
    const postRes = this.postRepository.update(id, post)
    promiseList.push(postRes)

    rename('post_files/temp', `post_files/${id}`, function (err) {
      if (err) {
        console.log(err)
      }
    })

    await Promise.all(promiseList)

    // const fileRes = []
    // values.forEach((value) => {
    //   fileRes.push(value.id)
    // })

    return this.postRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.postRepository.delete({ id });
  }
}
