import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { CharactersModule } from './characters/characters.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ComicsModule } from './comics/comics.module';
import { EventsModule } from './events/events.module';
import { CreatorsModule } from './creators/creators.module';
import { SeriesModule } from './series/series.module';
import { StoriesModule } from './stories/stories.module';
import config from './config';

@Module({
  imports: [
  ConfigModule.forRoot({
    load: [config],
  }),
  RedisModule.forRootAsync({
    imports:[ConfigModule],
    inject: [ConfigService],
    useFactory:  (configService: ConfigService) => {
      return {
        config: configService.get('redisConfig')
      };
    }
  }),
  HttpModule,
  CharactersModule,
  ComicsModule,
  EventsModule,
  CreatorsModule,
  SeriesModule,
  StoriesModule],
})
export class AppModule {}
