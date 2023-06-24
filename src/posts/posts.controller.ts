import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }


  @Get()
  findAll(
    @Query('ids') ids?: number[] | number,
    @Query('page') page?: number,
    @Query('take') takeProps?: number,
    @Query('categoryFilters') categoryFilters?: string[] | string) {
    if (ids !== undefined) {
      return this.postsService.getPostsByIds(Array.isArray(ids) ? ids : [ids]);
    } else {
      const take = takeProps ? takeProps : undefined;
      return this.postsService.findAll({
        take,
        skip: (page - 1) * take,
        categoryFilters: categoryFilters !== undefined ?
          Array.isArray(categoryFilters) ? categoryFilters : [categoryFilters]
          : undefined
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

}
