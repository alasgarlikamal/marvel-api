import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ComicsService } from './comics.service';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @Post('/seed-data')
  seedData(){
    return this.comicsService.getComicsData();
  }

  @Get()
  getAllComics(){
    return this.comicsService.getAllComics();
  }

  @Get('/:comicId')
  getComicById(@Param('comicId', ParseIntPipe) comicId: number){
    return this.comicsService.getComicById(comicId);
  }

  @Get('/:comicId/comics')
  getComicsCharacters(@Param('comicId', ParseIntPipe) comicId: number){
    return this.comicsService.getComicCharacters(comicId);
  }

  @Get('/:comicId/creators')
  getComicCreators(@Param('comicId', ParseIntPipe) comicId: number){
    return this.comicsService.getComicCreators(comicId);
  }

  @Get('/:comicId/events')
  getComicEvents(@Param('comicId', ParseIntPipe) comicId: number){
    return this.comicsService.getComicEvents(comicId);
  }

  @Get('/:comicId/stories')
  getComicStories(@Param('comicId', ParseIntPipe) comicId: number){
    return this.comicsService.getComicStories(comicId);
  }

}
