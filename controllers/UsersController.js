/* eslint-disable consistent-return */
import { ObjectId } from 'mongodb';

import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(request, response) {
    try {
      const { email, password } = request.body;
      if (!email) return response.status(400).send({ error: 'Missing email' });
      if (!password) return response.status(400).send({ error: 'Missing password' });
      const collection = dbClient.db.collection('users');
      const isExist = await collection.findOne({ email });
      if (isExist) return response.status(400).send({ error: 'Already exist' });
      const hashPass = sha1(password);
      collection.insertOne({ email, hashPass });
      const userid = await collection.findOne(
        { email }, { projection: { email: 1 } },
      );
      return response.status(201).send({ email, userid });
    } catch (error) {
      return response
        .status(500)
        .send({
          error: `Internal Server Error${error}`,
          isAlive: dbClient.isAlive(),
          files: await dbClient.nbFiles(),
          users: await dbClient.nbUsers(),
        });
    }
  }

  static async getMe(req, res) {
    try {
      const userToken = req.header('X-Token');
      const authKey = `auth_${userToken}`;
      const userID = await redisClient.get(authKey);
      if (!userID) {
        res.status(401).json({ error: 'Unauthorized' });
      }
      const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userID) });
      res.json({ id: user._id, email: user.email });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `Server error :${error}` });
    }
  }
}

export default UsersController;
