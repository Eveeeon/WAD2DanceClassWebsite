const Datastore = require("gray-nedb");
const metadataDAO = require("./metaDataDAO");

class ClassDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/classes.db", autoload: true });
  }

  // Takes a single class or an array of classes and inserts them into the database
  async insert(classes) {
    // Handle array of classes
    if (Array.isArray(classes)) {
      // Get IDs for all classes at once
      const promises = classes.map(async (danceClass) => {
        const id = await metadataDAO.getNextClassId();
        danceClass.id = id;
        return danceClass;
      });
      
      // Wait for all IDs to be assigned
      const classesWithIds = await Promise.all(promises);
      
      // Insert all classes at once
      return new Promise((resolve, reject) => {
        this.db.insert(classesWithIds, (err, newDocs) => {
          if (err) reject(err);
          resolve(newDocs);
        });
      });
    } 
    // Handle single class
    else {
      // Get ID for the class
      const id = await metadataDAO.getNextClassId();
      classes.id = id;
      
      // Insert the class
      return new Promise((resolve, reject) => {
        this.db.insert(classes, (err, newDoc) => {
          if (err) reject(err);
          resolve(newDoc);
        });
      });
    }
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