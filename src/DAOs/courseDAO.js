const Datastore = require("gray-nedb");

class CourseDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/courses.db", autoload: true });
  }

  async insert(course) {
    return new Promise((resolve, reject) => {
      this.db.insert(course, (err, newDoc) => {
        if (err) reject(err);
        this.db.persistence.compactDatafile();
        resolve(newDoc);
      });
    });
  }

  async updateClassIds(courseId, classIds) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: courseId }, { $set: { classIds } }, {}, (err, numAffected) => {
        if (err) reject(err);
        this.db.persistence.compactDatafile();
        resolve(numAffected);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }
}

module.exports = new CourseDAO();
