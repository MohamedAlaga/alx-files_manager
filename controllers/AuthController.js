import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    try {
      const auth = req.headers.authorization.replace('Basic ', '');
      if (!auth) return res.status(401).send({ error: 'Unauthorized no token' });
      const authDecoded = Buffer.from(auth, 'base64').toString('utf-8');
      const [email, password] = authDecoded.split(':');
      const hashPass = sha1(password);
      const user = await dbClient.db.collection('users').findOne({ email, hashPass });
      if (!user) return res.status(401).send({ error: 'Unauthorized no match' });
      const token = uuidv4();

      await redisClient.set(`auth_${token}`, user._id.toString(), 86400);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;
