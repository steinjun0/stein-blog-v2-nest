import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
    @Query('page') page?: number,
    @Query('take') takeProps?: number,
    @Query('tagFilter') tagFilter?: 'All' | 'Study' | 'Engineering' | 'Music' | 'Art' | 'etc') {
    if (Number.isNaN(page)) {
      return this.postsService.findAll();
    } else {
      const take = takeProps ? takeProps : 10
      return this.postsService.findAll({ take, skip: (page - 1) * take, tagFilter })
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
