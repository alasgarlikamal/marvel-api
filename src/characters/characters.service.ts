import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CharactersService {

    constructor(
        @InjectRedis() private redis: Redis,
        private httpService: HttpService,
        private configService: ConfigService
    ){}

    async getCharacterData(){

        try {

            if (!await this.redis.exists('marvelcharacters:all')){
                const request = this.httpService.get('https://gateway.marvel.com:443/v1/public/characters', {
                    params: this.configService.get('marvelApiConfig')
                });
    
                const characters = (await lastValueFrom(request)).data;
    
                await this.redis.call("JSON.SET", "marvelcharacters:all", "$", JSON.stringify(characters));
    
                await this.redis.call('FT.CREATE', 'marvelcharacters', 'ON', 'JSON', 'PREFIX', '1', 'marvelcharacters:', 'SCHEMA', '$.name', 'as', 'name', 'TEXT', '$.id', 'as', 'id', 'NUMERIC');
    
                await Promise.all(characters.data.results.map(async (character: any, index: number) => {
                    await this.redis.call("JSON.SET", `marvelcharacters:${index+1}`, "$", JSON.stringify(character))             
                }));

                return characters;
            }
                
            throw new ConflictException('Database already seeded!');
            
        } catch (error) {
            return error;
        }
    }

    async getAllCharacters(){
        const characters = await this.redis.call('JSON.GET','marvelcharacters:all');
        
        if(!characters) throw new NotFoundException('Characters not found, seed the data first!');

        return characters;
    }

    async getCharacterById(id: number){
        const character = JSON.stringify(await this.redis.call("FT.SEARCH", "marvelcharacters", `@id:[${id} ${id}]`));

        if (!character || character === '[0]') throw new NotFoundException(`Character with id ${id} not found`);

        const parsedData = JSON.parse(JSON.parse(character)[2][1]);

        return parsedData;
    }

    async getCharacterComics(id: number) {
        return (await this.getCharacterById(id)).comics;
    }

    async getCharacterEvents(id: number) {
        return (await this.getCharacterById(id)).events;
    }

    async getCharacterSeries(id: number) {
        return (await this.getCharacterById(id)).series;
    }

    async getCharacterStories(id: number) {
        return (await this.getCharacterById(id)).stories;
    }
}
