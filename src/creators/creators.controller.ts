import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreatorsService } from './creators.service';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Post('/seed-data')
  seedData(){
    return this.creatorsService.getCreatorsData();
  }

  @Get()
  getAllCreators(){
    return this.creatorsService.getAllCreators();
  }

  @Get('/:creatorId')
  getCreatorsById(@Param('creatorId', ParseIntPipe) creatorId: number){
    return this.creatorsService.getCreatorById(creatorId);
  }

  @Get('/:creatorId/comics')
  getCreatorsComics(@Param('creatorId', ParseIntPipe) creatorId: number){
    return this.creatorsService.getCreatorComics(creatorId);
  }

  @Get('/:creatorId/events')
  getCreatorsEvents(@Param('creatorId', ParseIntPipe) creatorId: number){
    return this.creatorsService.getCreatorEvents(creatorId);
  }

  @Get('/:creatorId/series')
  getCreatorsSeries(@Param('creatorId', ParseIntPipe) creatorId: number){
    return this.creatorsService.getCreatorSeries(creatorId);
  }

  @Get('/:creatorId/stories')
  getCreatorsStories(@Param('creatorId', ParseIntPipe) creatorId: number){
    return this.creatorsService.getCreatorStories(creatorId);
  }
}
