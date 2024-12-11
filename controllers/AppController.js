import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getStatus = (req, res) => {
  res.status(200).send({
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  });
};

const getStats = async (req, res) => {
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();
  res.status(200).send({ users, files });
};

export default {
  getStatus,
  getStats,
};
