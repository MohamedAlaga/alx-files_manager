const mongo = require("mongodb");

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || "localhost";
    this.port = process.env.DB_PORT || 27017;
    this.db = mongo.MongoClient.connect(`${this.host}:${this.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => client.db(process.env.DB_DATABASE || "files_manager"));
  }

  isAlive() {
    return this.db.then((db) => db.command({ ping: 1 }).then(() => true));
  }

  nbUsers() {
    return this.db.then((db) => db.collection("users").countDocuments());
  }

  nbFiles() {
    return this.db.then((db) => db.collection("files").countDocuments());
  }
}

const dbClient = new DBClient();

export default dbClient;
