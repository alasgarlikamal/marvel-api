import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StoriesService {

    constructor(
        @InjectRedis() private redis: Redis,
        private httpService: HttpService,
        private configService: ConfigService
    ){}

    async getStoriesData(){

        try {
            const request = this.httpService.get('https://gateway.marvel.com:443/v1/public/stories', {
                params: this.configService.get('marvelApiConfig')
            });

            const stories = (await lastValueFrom(request)).data;

            await this.redis.call('FT.CREATE', 'marvelstories', 'ON', 'JSON', 'PREFIX', '1', 'marvelstories:', 'SCHEMA', '$.title', 'as', 'title', 'TEXT', '$.id', 'as', 'id', 'NUMERIC');
            
            await Promise.all(stories.data.results.map(async (story: any, index: number) => {
                await this.redis.call("JSON.SET", `marvelstories:${index+1}`, "$", JSON.stringify(story))
            }));    
        
            await this.redis.call("JSON.SET", "marvelstories:all", "$", JSON.stringify(stories));

            return stories;
            
        } catch (error) {
            return error;
        }
    }

    async getAllStories(){
        const stories = await this.redis.call('JSON.GET','marvelstories:all');
        
        if(!stories) throw new NotFoundException('Stories not found, seed the data first!');

        return stories;
    }

    async getStoryById(id: number){
        const stories = JSON.stringify(await this.redis.call("FT.SEARCH", "marvelstories", `@id:[${id} ${id}]`));

        if (!stories || stories === '[0]') throw new NotFoundException(`Stories with id ${id} not found`);

        const parsedData = JSON.parse(JSON.parse(stories)[2][1]);

        return parsedData;
    }

    async getStoryCharacters(id: number) {
        return (await this.getStoryById(id)).characters;
    }

    async getStoryComics(id: number) {
        return (await this.getStoryById(id)).comics;
    }

    async getStoryCreators(id: number) {
        return (await this.getStoryById(id)).creators;
    }

    async getStoryEvents(id: number) {
        return (await this.getStoryById(id)).events;
    }

    async getStorySeries(id: number) {
        return (await this.getStoryById(id)).series;
    }
}
