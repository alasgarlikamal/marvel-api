import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post('/seed-data')
  seedData(){
    return this.seriesService.getSeriesData();
  }

  @Get()
  getAllSeries(){
    return this.seriesService.getAllSeries();
  }

  @Get('/:seriesId')
  getSeriesById(@Param('seriesId', ParseIntPipe) seriesId: number){
    return this.seriesService.getSeriesById(seriesId);
  }

  @Get('/:seriesId/characters')
  getSeriesCharacters(@Param('seriesId', ParseIntPipe) seriesId: number){
    return this.seriesService.getSeriesCharacters(seriesId);
  }

  @Get('/:seriesId/comics')
  getSeriesComics(@Param('seriesId', ParseIntPipe) seriesId: number){
    return this.seriesService.getSeriesComics(seriesId);
  }

  @Get('/:seriesId/creators')
  getSeriesCreators(@Param('seriesId', ParseIntPipe) seriesId: number){
    return this.seriesService.getSeriesCreators(seriesId);
  }

  @Get('/:seriesId/events')
  getSeriesEvents(@Param('seriesId', ParseIntPipe) seriesId: number){
    return this.seriesService.getSeriesEvents(seriesId);
  }

  @Get('/:seriesId/stories')
  getSeriesStories(@Param('seriesId', ParseIntPipe) seriesId: number){
    return this.seriesService.getSerieStories(seriesId);
  }
}
