import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, rename, renameSync, rmdir, rmdirSync } from 'fs';
import { Any, ArrayContainedBy, ArrayContains, DataSource, FindManyOptions, getManager, In, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { File } from '../file/entities/file.entity';
import { Post } from './entities/post.entity';

import { marked } from "marked";

var mergedirs = require('merge-dirs').default;


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(File)
    private fileRepository: Repository<File>,

    private datasource: DataSource
  ) { }

  async updateCategories(categories: string[]): Promise<Category[]> {
    const promises: Promise<Category>[] = [];
    for (const categoryName of categories) {
      const findPromise = this.categoryRepository.findOneBy({ name: categoryName });
      promises.push(findPromise.then((category) => {
        let categoryOrPromise: null | Category | Promise<Category> = category;
        if (category === null) {
          const tempCategory = new Category();
          tempCategory.name = categoryName;
          categoryOrPromise = this.categoryRepository.save(tempCategory);
        }
        return categoryOrPromise;
      }));
    }
    const resPromise = Promise.all(promises);
    resPromise.then((v) => {
      return [...v];
    });
    return resPromise;
  }

  async updateFiles(post: Post, files: string[]) {
    for (const fileName of files) {
      const file = await this.fileRepository.findOneBy({ name: fileName });
      if (file === null) {
        const tempFile = new File();
        tempFile.name = fileName;
        tempFile.post = post;
        this.fileRepository.save(tempFile);
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

    post.categories = await this.updateCategories(createPostDto.categories);

    const postRes = await this.postRepository.save(post);
    this.postRepository.update(postRes.id, { body: post.body.replace(/file\/post\/temp/gi, `file/post/${postRes.id}`).replace(/\/\/localhost\:8888/gi, 'https://api.blog.steinjun.net') });

    const promiseList = [];
    for (const fileName of createPostDto.files) {
      const file = new File();
      file.name = fileName;
      file.post = postRes;
      promiseList.push(this.fileRepository.save(file));
    }

    renameSync('post_files/temp', `post_files/${postRes.id}`);

    const values = await Promise.all(promiseList);

    const fileRes = [];
    values.forEach((value) => {
      fileRes.push(value.id);
    });

    return { postRes: postRes, fileRes: fileRes };
  }

  async findAll(options?: { take?: number, skip?: number, categoryFilters?: string[]; }) {
    const findOptions: FindManyOptions<Post> = {
      order: {
        id: 'DESC',
      },
      relations: ['categories', 'files'],
      take: options?.take,
      skip: options && (isNaN(options.skip) ? 0 : options.skip),
    };




    if (options?.categoryFilters?.length) {
      findOptions.where = {
        categories: {
          name: In(options.categoryFilters),
        },
      };
    }

    let result = null;
    const posts = await this.postRepository.find(findOptions);
    if (options?.categoryFilters?.length) {
      const ids = posts.map((post) => post.id);
      result = await this.postRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.categories', 'category')
        .leftJoinAndSelect('post.files', 'file')
        .where('post.id IN (:...ids)', { ids })
        .orderBy('post.id', 'DESC')
        .getMany();
    } else {
      result = posts;
    }

    result.forEach((post) => {
      post.body = marked.parse(post.body).replace(/<[^>]*>|\n|[\-]|\s\s/g, '').slice(0, 1000);
    });


    return result;
  }

  findOne(id: number) {
    return this.postRepository.findOne({ where: { id }, relations: ['categories', 'files'] });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    post.created_at = undefined;
    post.updated_at = undefined;
    post.title = updatePostDto.title;
    post.subtitle = updatePostDto.subtitle;
    post.body = updatePostDto.body;
    // post.files = [];
    // post.categories = []
    const promiseList: Promise<any>[] = [];
    promiseList.push(this.updateCategories(updatePostDto.categories).then((categories) => post.categories = categories));
    promiseList.push(this.updateFiles(post, updatePostDto.files));
    // post.body = post.body.replace(/file\/post\/temp/gi, `file/post/${id}`).replace('/\/\/localhost\:8888\/', 'https://api.blog.steinjun.net')
    post.body = post.body.replace(/file\/post\/temp/gi, `file/post/${id}`).replace(/\/\/localhost\:8888/gi, 'https://api.blog.steinjun.net');
    return Promise.all(promiseList)
      .then(() => {
        console.log('post', post);
        this.postRepository.save(post);
      })
      .then(() => {
        if (existsSync('post_files/temp'))
          mergedirs('post_files/temp', `post_files/${id}`);
        return this.postRepository.findOneBy({ id });
      });
  }

  async remove(id: number) {
    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let res: Promise<any>;
    try {
      const deletingPost = await this.postRepository.findOneBy({ id });
      await this.fileRepository.delete({ post: deletingPost });
      res = this.postRepository.delete({ id });
      res.then(() => {
        if (existsSync(`post_files/${id}`)) {
          rmdirSync(`post_files/${id}`, { recursive: true });
        }

      });

    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return res;
    }
  }

  async getPostsByIds(ids: number[]) {
    const res = await this.postRepository.find(
      {
        relations: ['categories'],
        where: {
          id: In(ids)
        }
      }
    );
    res.map(e => {
      e.body = marked.parse(e.body).replace(/<[^>]*>|\n|[\-]|\s\s/g, '').slice(0, 1000);
    });
    return res;
  }
}

