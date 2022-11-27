import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/seed-data')
  seedData(){
    return this.eventsService.getEventsData();
  }

  @Get()
  getAllComics(){
    return this.eventsService.getAllEvents();
  }

  @Get('/:eventId')
  getEventById(@Param('eventId', ParseIntPipe) eventId: number){
    return this.eventsService.getEventById(eventId);
  }

  @Get('/:eventId/characters')
  getEventCharacters(@Param('eventId', ParseIntPipe) eventId: number){
    return this.eventsService.getEventCharacters(eventId);
  }

  @Get('/:eventId/comics')
  getEventComics(@Param('eventId', ParseIntPipe) eventId: number){
    return this.eventsService.getEventComics(eventId);
  }

  @Get('/:eventId/creators')
  getEventCreators(@Param('eventId', ParseIntPipe) eventId: number){
    return this.eventsService.getEventCreators(eventId);
  }

  @Get('/:eventId/series')
  getEventSeries(@Param('eventId', ParseIntPipe) eventId: number){
    return this.eventsService.getEventSeries(eventId);
  }

  @Get('/:eventId/stories')
  getEventStories(@Param('eventId', ParseIntPipe) eventId: number){
    return this.eventsService.getEventStories(eventId);
  }
}
