const Datastore = require('gray-nedb');
const path = require('path');

class ClassDAO {
  constructor() {
    this.classDB = new Datastore({
      filename: path.join(__dirname, '../database/classes.db'),
      autoload: true
    });
  }

  // Insert a Class
  async insertClass(danceClass) {
    return new Promise((resolve, reject) => {
      this.classDB.insert(danceClass, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  }

  // Retrieve all Classes
  async getAllClasses() {
    return new Promise((resolve, reject) => {
      this.classDB.find({}, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Retrieve classes by course
  async getClassesByCourse(courseName) {
    return new Promise((resolve, reject) => {
      this.classDB.find({ courseName }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
}

module.exports = new ClassDAO();
