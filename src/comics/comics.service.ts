import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ComicsService {

    constructor(
        @InjectRedis() private redis: Redis,
        private httpService: HttpService,
        private configService: ConfigService
    ){}

    async getComicsData(){

        try {
            const request = this.httpService.get('https://gateway.marvel.com:443/v1/public/comics', {
                params: this.configService.get('marvelApiConfig')
            });

            const comics = (await lastValueFrom(request)).data;

            await this.redis.call('FT.CREATE', 'marvelcomics', 'ON', 'JSON', 'PREFIX', '1', 'marvelcomics:', 'SCHEMA', '$.title', 'as', 'title', 'TEXT', '$.id', 'as', 'id', 'NUMERIC');

            await Promise.all(comics.data.results.map(async (comic: any, index: number) => {
                await this.redis.call("JSON.SET", `marvelcomics:${index+1}`, "$", JSON.stringify(comic))
            }));    
        
            await this.redis.call("JSON.SET", "marvelcomics:all", "$", JSON.stringify(comics));

            return comics;
            
        } catch (error) {
            return error;
        }
    }

    async getAllComics(){
        const comics = await this.redis.call('JSON.GET','marvelcomics:all');
        
        if(!comics) throw new NotFoundException('Comics not found, seed the data first!');

        return comics;
    }

    async getComicById(id: number){
        const comic = JSON.stringify(await this.redis.call("FT.SEARCH", "marvelcomics", `@id:[${id} ${id}]`));

        if (!comic || comic === '[0]') throw new NotFoundException(`Comic with id ${id} not found`);

        const parsedData = JSON.parse(JSON.parse(comic)[2][1]);

        return parsedData;
    }

    async getComicCharacters(id: number) {
        return (await this.getComicById(id)).characters;
    }

    async getComicEvents(id: number) {
        return (await this.getComicById(id)).events;
    }

    async getComicCreators(id: number) {
        return (await this.getComicById(id)).creators;
    }

    async getComicStories(id: number) {
        return (await this.getComicById(id)).stories;
    }
}
