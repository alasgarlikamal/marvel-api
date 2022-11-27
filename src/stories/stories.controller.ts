import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post('/seed-data')
  seedData(){
    return this.storiesService.getStoriesData();
  }

  @Get()
  getAllSeries(){
    return this.storiesService.getAllStories();
  }

  @Get('/:storyId')
  getStoryById(@Param('storyId', ParseIntPipe) storyId: number){
    return this.storiesService.getStoryById(storyId);
  }

  @Get('/:storyId/characters')
  getStoryCharacters(@Param('storyId', ParseIntPipe) storyId: number){
    return this.storiesService.getStoryCharacters(storyId);
  }

  @Get('/:storyId/comics')
  getStoryComics(@Param('storyId', ParseIntPipe) storyId: number){
    return this.storiesService.getStoryComics(storyId);
  }

  @Get('/:storyId/creators')
  getStoryCreators(@Param('storyId', ParseIntPipe) storyId: number){
    return this.storiesService.getStoryCreators(storyId);
  }

  @Get('/:storyId/events')
  getStoryEvents(@Param('storyId', ParseIntPipe) storyId: number){
    return this.storiesService.getStoryEvents(storyId);
  }

  @Get('/:storyId/series')
  getStorySeries(@Param('storyId', ParseIntPipe) storyId: number){
    return this.storiesService.getStorySeries(storyId);
  }
}
