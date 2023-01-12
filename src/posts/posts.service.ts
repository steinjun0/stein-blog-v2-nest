import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, rename, renameSync, rmdir, rmdirSync } from 'fs';
import { DataSource, getManager, In, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from './entities/category.entity';
import { File } from '../file/entities/file.entity';
import { Post } from './entities/post.entity';

var mergedirs = require('merge-dirs').default


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
    const promises: Promise<Category>[] = []
    for (const categoryName of categories) {
      const findPromise = this.categoryRepository.findOneBy({ name: categoryName })
      promises.push(findPromise.then((category) => {
        let categoryOrPromise: null | Category | Promise<Category> = category
        if (category === null) {
          const tempCategory = new Category()
          tempCategory.name = categoryName
          categoryOrPromise = this.categoryRepository.save(tempCategory)
        }
        return categoryOrPromise
      }))
    }
    const resPromise = Promise.all(promises)
    resPromise.then((v) => {
      return [...v]
    })
    return resPromise
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

    post.categories = await this.updateCategories(createPostDto.categories)

    const postRes = await this.postRepository.save(post)
    this.postRepository.update(postRes.id, { body: post.body.replace(/file\/post\/temp/gi, `file/post/${postRes.id}`).replace(/\/\/localhost\:8888/gi, 'https://api.blog.steinjun.net') })

    const promiseList = []
    for (const fileName of createPostDto.files) {
      const file = new File()
      file.name = fileName
      file.post = postRes
      promiseList.push(this.fileRepository.save(file))
    }

    renameSync('post_files/temp', `post_files/${postRes.id}`)

    const values = await Promise.all(promiseList)

    const fileRes = []
    values.forEach((value) => {
      fileRes.push(value.id)
    })

    return { postRes: postRes, fileRes: fileRes };
  }

  async findAll(options?: { take?: number, skip?: number, tagFilter?: 'All' | 'Study' | 'Engineering' | 'Music' | 'Art' | 'etc' }) {
    const tagFilterObject: { Study: string[], Engineering: string[], Music: string[], Art: string[] } = {
      Study: ['Study'],
      Engineering: ['React', 'Next', 'Vue', 'Nuxt', 'Flutter', 'Django', 'Nest', 'Flutter', 'UnrealEngine5', 'Docker', 'Web'],
      Music: ['Music', 'Compose', 'Recording'],
      Art: ['Art', 'Video', 'Camera', 'Photo', 'Video'],
    }
    const tagList = ['Study', 'Engineering', 'Art', 'Life']
    const res = await this.postRepository.find(
      {
        order: {
          id: "DESC",
        },
        // loadRelationIds: true
        relations: ['categories', 'files'],
        take: options && options.take,
        skip: options && options.skip,
        where: options && !['All', undefined].includes(options.tagFilter) && {
          categories: {
            name: options.tagFilter === 'etc'
              ?
              Not(In(tagList.map(e => tagFilterObject[e]).flat()))
              :
              In(tagFilterObject[options.tagFilter])
          }
        }
      }
    );
    res.map(e => e.body = e.body.slice(0, 500))
    return res
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
    promiseList.push(this.updateCategories(updatePostDto.categories).then((categories) => post.categories = categories))
    promiseList.push(this.updateFiles(post, updatePostDto.files))
    // post.body = post.body.replace(/file\/post\/temp/gi, `file/post/${id}`).replace('/\/\/localhost\:8888\/', 'https://api.blog.steinjun.net')
    post.body = post.body.replace(/file\/post\/temp/gi, `file/post/${id}`).replace(/\/\/localhost\:8888/gi, 'https://api.blog.steinjun.net')
    return Promise.all(promiseList)
      .then(() => {
        console.log('post', post)
        this.postRepository.save(post)
      })
      .then(() => {
        mergedirs('post_files/temp', `post_files/${id}`)
        return this.postRepository.findOneBy({ id })
      })
  }

  async remove(id: number) {
    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let res: Promise<any>
    try {
      const deletingPost = await this.postRepository.findOneBy({ id })
      await this.fileRepository.delete({ post: deletingPost })
      res = this.postRepository.delete({ id });
      res.then(() => {
        if (existsSync(`post_files/${id}`)) {
          rmdirSync(`post_files/${id}`, { recursive: true });
        }

      })

    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return res
    }
  }
}
