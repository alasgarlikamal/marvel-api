import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SeriesService {

    constructor(
        @InjectRedis() private redis: Redis,
        private httpService: HttpService,
        private configService: ConfigService
    ){}

    async getSeriesData(){

        try {
            const request = this.httpService.get('https://gateway.marvel.com:443/v1/public/series', {
                params: this.configService.get('marvelApiConfig')
            });

            const series = (await lastValueFrom(request)).data;

            await this.redis.call('FT.CREATE', 'marvelseries', 'ON', 'JSON', 'PREFIX', '1', 'marvelseries:', 'SCHEMA', '$.title', 'as', 'title', 'TEXT', '$.id', 'as', 'id', 'NUMERIC');

            await Promise.all(series.data.results.map(async (serie: any, index: number) => {
                await this.redis.call("JSON.SET", `marvelseries:${index+1}`, "$", JSON.stringify(serie))
            }));    
        
            await this.redis.call("JSON.SET", "marvelseries:all", "$", JSON.stringify(series));

            return series;
            
        } catch (error) {
            return error;
        }
    }

    async getAllSeries(){
        const series = await this.redis.call('JSON.GET','marvelseries:all');
        
        if(!series) throw new NotFoundException('Series not found, seed the data first!');

        return series;
    }

    async getSeriesById(id: number){
        const series = JSON.stringify(await this.redis.call("FT.SEARCH", "marvelseries", `@id:[${id} ${id}]`));

        if (!series || series === '[0]') throw new NotFoundException(`Series with id ${id} not found`);

        const parsedData = JSON.parse(JSON.parse(series)[2][1]);

        return parsedData;
    }

    async getSeriesCharacters(id: number) {
        return (await this.getSeriesById(id)).characters;
    }

    async getSeriesComics(id: number) {
        return (await this.getSeriesById(id)).comics;
    }

    async getSeriesCreators(id: number) {
        return (await this.getSeriesById(id)).creators;
    }

    async getSeriesEvents(id: number) {
        return (await this.getSeriesById(id)).events;
    }

    async getSerieStories(id: number) {
        return (await this.getSeriesById(id)).stories;
    }
}
