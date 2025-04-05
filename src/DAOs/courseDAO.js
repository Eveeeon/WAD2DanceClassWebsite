const Datastore = require("gray-nedb");

class CourseDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/courses.db", autoload: true });
  }

  // Insert a single course into the database
  async insert(course) {
    return new Promise((resolve, reject) => {
      this.db.insert(course, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      });
    });
  }

  // Find a course by its ID
  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ id }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  // Find all courses
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