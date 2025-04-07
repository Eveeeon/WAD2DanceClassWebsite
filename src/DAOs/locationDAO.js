const Datastore = require("gray-nedb");

class LocationDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/locations.db", autoload: true });
  }

  async insert(location) {
    return new Promise((resolve, reject) => {
      this.db.insert(location, (err, newDoc) => {
        if (err) return reject(err);
        this.db.persistence.compactDatafile();
        resolve(newDoc);
      });
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  async update(id, updateData) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: id }, { $set: updateData }, {}, (err, numAffected) => {
        if (err) return reject(err);
        this.db.persistence.compactDatafile();
        resolve(numAffected);
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) return reject(err);
        this.db.persistence.compactDatafile();
        resolve(numRemoved);
      });
    });
  }
}

module.exports = new LocationDAO();
