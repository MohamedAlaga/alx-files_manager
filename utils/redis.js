import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient().on('error', (err) => {
      console.log(err.message);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async get(key) {
    const value = await this.client.get(key);
    return value;
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
