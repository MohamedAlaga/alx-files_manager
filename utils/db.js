const mongo = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'mongodb://localhost';
    this.port = process.env.DB_PORT || 27017;
    this.isconnected = false;
    this.db = mongo.MongoClient.connect(`${this.host}:${this.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then((client) => {
        this.isconnected = true;
        return client.db(process.env.DB_DATABASE || 'files_manager');
      })
      .catch(() => {
        this.isconnected = false;
      });
  }

  isAlive() {
    return this.isconnected;
  }

  nbUsers() {
    if (!this.isAlive()) return 0;
    return this.db.then((db) => db.collection('users').countDocuments());
  }

  nbFiles() {
    if (!this.isAlive()) return 0;
    return this.db.then((db) => db.collection('files').countDocuments());
  }
}

const dbClient = new DBClient();

export default dbClient;
