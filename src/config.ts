export default () => ({

    port: parseInt(process.env.PORT, 10) || 3000,

    marvelApiConfig: {
        apikey: process.env.MARVEL_API_KEY,
        hash: process.env.MARVEL_API_HASH,
        ts: process.env.MARVEL_API_TS
    },

    redisConfig: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379
    }
  });