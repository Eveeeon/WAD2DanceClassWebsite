const Datastore = require("gray-nedb");

class ClassDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/classes.db", autoload: true });
  }

  // Takes a single class or a array of classes and inserts them into the database
  async insert(classes) {
    return new Promise((resolve, reject) => {
      // If classes is an array, insert all at once
      if (Array.isArray(classes)) {
        this.db.insert(classes, (err, newDocs) => {
          if (err) reject(err);
          resolve(newDocs);
        });
      } else {
        this.db.insert(classes, (err, newDoc) => {
          if (err) reject(err);
          resolve(newDoc);
        });
      }
    });
  }

  // Find a class by its ID
  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ id }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  // Find all classes for a given course ID
  async findByCourseId(courseId) {
    return new Promise((resolve, reject) => {
      this.db.find({ courseId }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  // Remove a class by its ID
  async removeById(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        resolve(numRemoved);
      });
    });
  }
}

module.exports = new ClassDAO();
