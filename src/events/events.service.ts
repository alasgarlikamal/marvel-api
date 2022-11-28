import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EventsService {

    constructor(
        @InjectRedis() private redis: Redis,
        private httpService: HttpService,
        private configService: ConfigService
    ){}

    async getEventsData(){

        try {
            if (!await this.redis.exists('marvelevents:all')){

            const request = this.httpService.get('https://gateway.marvel.com:443/v1/public/events', {
                params: this.configService.get('marvelApiConfig')
            });

            const events = (await lastValueFrom(request)).data;

            await this.redis.call('FT.CREATE', 'marvelevents', 'ON', 'JSON', 'PREFIX', '1', 'marvelevents:', 'SCHEMA', '$.title', 'as', 'title', 'TEXT', '$.id', 'as', 'id', 'NUMERIC');

            await Promise.all(events.data.results.map(async (event: any, index: number) => {
                await this.redis.call("JSON.SET", `marvelevents:${index+1}`, "$", JSON.stringify(event))
            }));    
        
            await this.redis.call("JSON.SET", "marvelevents:all", "$", JSON.stringify(events));

            return events;
        }

        throw new ConflictException('Database already seeded!');
            
        } catch (error) {
            return error;
        }
    }

    async getAllEvents(){
        const events = await this.redis.call('JSON.GET','marvelevents:all');
        
        if(!events) throw new NotFoundException('Events not found, seed the data first!');

        return events;
    }

    async getEventById(id: number){
        const event = JSON.stringify(await this.redis.call("FT.SEARCH", "marvelevents", `@id:[${id} ${id}]`));

        if (!event || event === '[0]') throw new NotFoundException(`Event with id ${id} not found`);

        const parsedData = JSON.parse(JSON.parse(event)[2][1]);

        return parsedData;
    }

    async getEventCharacters(id: number) {
        return (await this.getEventById(id)).characters;
    }

    async getEventComics(id: number) {
        return (await this.getEventById(id)).comics;
    }

    async getEventCreators(id: number) {
        return (await this.getEventById(id)).creators;
    }

    async getEventSeries(id: number) {
        return (await this.getEventById(id)).series;
    }

    async getEventStories(id: number) {
        return (await this.getEventById(id)).stories;
    }
}
