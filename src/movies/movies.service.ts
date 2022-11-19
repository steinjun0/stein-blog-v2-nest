import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) { }

  getAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  getOne(id: string): Promise<Movie> {
    return this.movieRepository.findOneBy({ id: +id });
  }

  deleteOne(id: string): Promise<DeleteResult> {
    return this.movieRepository.delete(+id);
  }

  create(movieData) {
    return this.movieRepository.create(movieData);
  }
}
