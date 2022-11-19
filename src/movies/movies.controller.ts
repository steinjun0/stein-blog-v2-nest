import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {

  constructor(readonly moviesService: MoviesService) { }

  @Get()
  getAll() {
    return this.moviesService.getAll();
  }

  @Get("/:id")
  getOne(@Param("id") movieId: string) {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData) {
    return this.moviesService.create(movieData);
  }

  @Delete("/:id")
  delete(@Param("id") movieId: string) {
    return this.moviesService.deleteOne(movieId);
  }

  @Patch("/:id")
  patch(@Param("id") movieId: string, @Body() updateData) {
    return {
      updateMovie: movieId,
      ...updateData
    };
  }


}
