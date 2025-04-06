const Datastore = require("gray-nedb");

class ClassDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/classes.db", autoload: true });
  }

  async insert(classes) {
    if (Array.isArray(classes)) {
      return new Promise((resolve, reject) => {
        this.db.insert(classes, (err, newDocs) => {
          if (err) reject(err);
          this.db.persistence.compactDatafile();
          resolve(newDocs);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.db.insert(classes, (err, newDoc) => {
          if (err) reject(err);
          this.db.persistence.compactDatafile();
          resolve(newDoc);
        });
      });
    }
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  async findByCourseId(courseId) {
    return new Promise((resolve, reject) => {
      this.db.find({ courseId }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  async removeById(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        this.db.persistence.compactDatafile();
        resolve(numRemoved);
      });
    });
  }
}

module.exports = new ClassDAO();
