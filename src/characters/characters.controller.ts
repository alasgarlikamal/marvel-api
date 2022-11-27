import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}


  @Post('/seed-data')
  seedData(){
    return this.charactersService.getCharacterData();
  }

  @Get()
  getAllCharacters(){
    return this.charactersService.getAllCharacters();
  }

  @Get('/:characterId')
  getCharacterById(@Param('characterId', ParseIntPipe) characterId: number){
    return this.charactersService.getCharacterById(characterId);
  }

  @Get('/:characterId/comics')
  getCharacterComics(@Param('characterId', ParseIntPipe) characterId: number){
    return this.charactersService.getCharacterComics(characterId);
  }

  @Get('/:characterId/events')
  getCharacterEvents(@Param('characterId', ParseIntPipe) characterId: number){
    return this.charactersService.getCharacterEvents(characterId);
  }

  @Get('/:characterId/series')
  getCharacterSeries(@Param('characterId', ParseIntPipe) characterId: number){
    return this.charactersService.getCharacterSeries(characterId);
  }

  @Get('/:characterId/stories')
  getCharacterStories(@Param('characterId', ParseIntPipe) characterId: number){
    return this.charactersService.getCharacterStories(characterId);
  }

}
