const Datastore = require("gray-nedb");
const logger = require("pino")();

class LocationDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/locations.db", autoload: true });
  }

  async insert(location) {
    return new Promise((resolve, reject) => {
      this.db.insert(location, (err, newDoc) => {
        if (err) {
          logger.error({ err, op: "insert", location }, "Failed to insert location");
          return reject(err);
        }
        this.db.persistence.compactDatafile();
        logger.info({ op: "insert", location: newDoc }, "Inserted location");
        resolve(newDoc);
      });
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) {
          logger.error({ err, op: "findAll" }, "Failed to read all locations");
          return reject(err);
        }
        logger.info({ op: "findAll", count: docs.length }, "Read all locations");
        resolve(docs);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) {
          logger.error({ err, op: "findById", id }, "Failed to find location by ID");
          return reject(err);
        }
        logger.info({ op: "findById", id }, "Found location");
        resolve(doc);
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, (err) => {
        if (err) {
          logger.error({ err, op: "delete", id }, "Failed to delete location");
          return reject(err);
        }
        this.db.persistence.compactDatafile();
        logger.info({ op: "delete", id }, "Deleted location");
        resolve("Success");
      });
    });
  }
}

module.exports = new LocationDAO();
