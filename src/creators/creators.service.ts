import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreatorsService {

    constructor(
        @InjectRedis() private redis: Redis,
        private httpService: HttpService,
        private configService: ConfigService
    ){}

    async getCreatorsData(){

        try {
            const request = this.httpService.get('https://gateway.marvel.com:443/v1/public/creators', {
                params: this.configService.get('marvelApiConfig')
            });

            const creators = (await lastValueFrom(request)).data;

            await this.redis.call('FT.CREATE', 'marvelcreators', 'ON', 'JSON', 'PREFIX', '1', 'marvelcreators:', 'SCHEMA', '$.fullName', 'as', 'fullName', 'TEXT', '$.id', 'as', 'id', 'NUMERIC');

            await Promise.all(creators.data.results.map(async (creator: any, index: number) => {
                await this.redis.call("JSON.SET", `marvelcreators:${index+1}`, "$", JSON.stringify(creator))
            }));    
        
            await this.redis.call("JSON.SET", "marvelcreators:all", "$", JSON.stringify(creators));

            return creators;
            
        } catch (error) {
            return error;
        }
    }

    async getAllCreators(){
        const creators = await this.redis.call('JSON.GET','marvelcreators:all');
        
        if(!creators) throw new NotFoundException('Creators not found, seed the data first!');

        return creators;
    }

    async getCreatorById(id: number){
        const creator = JSON.stringify(await this.redis.call("FT.SEARCH", "marvelcreators", `@id:[${id} ${id}]`));

        if (!creator || creator === '[0]') throw new NotFoundException(`Creator with id ${id} not found`);

        const parsedData = JSON.parse(JSON.parse(creator)[2][1]);

        return parsedData;
    }

    async getCreatorComics(id: number) {
        return (await this.getCreatorById(id)).comics;
    }

    async getCreatorEvents(id: number) {
        return (await this.getCreatorById(id)).events;
    }

    async getCreatorSeries(id: number) {
        return (await this.getCreatorById(id)).series;
    }

    async getCreatorStories(id: number) {
        return (await this.getCreatorById(id)).stories;
    }
}
