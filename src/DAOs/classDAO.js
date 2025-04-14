const Datastore = require("gray-nedb");
const logger = require("pino")();

class ClassDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/classes.db", autoload: true });
  }

  async insert(classes) {
    return new Promise((resolve, reject) => {
      this.db.insert(classes, (err, result) => {
        if (err) {
          logger.error(
            { err, op: "insert", data: classes },
            "Failed to insert class/classes"
          );
          return reject(err);
        }
        logger.info({ op: "insert", data: result }, "Inserted class(es)");
        this.db.persistence.compactDatafile();
        resolve(result);
      });
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) {
          logger.error({ err, op: "findAll" }, "Failed to read all classes");
          return reject(err);
        }
        logger.info(
          { op: "findAll", count: docs.length },
          "Read all classes"
        );
        resolve(docs);
      });
    });
  }

  async findActive() {
    return new Promise((resolve, reject) => {
      this.db.find({ active: { $ne: false } }, (err, docs) => {
        if (err) {
          logger.error(
            { err, op: "findActive" },
            "Failed to read active classes"
          );
          return reject(err);
        }
        logger.info(
          { op: "findActive", count: docs.length },
          "Read active classes"
        );
        resolve(docs);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) {
          logger.error({ err, op: "findById", id }, "Failed to find class");
          return reject(err);
        }
        logger.info({ op: "findById", id }, "Found class");
        resolve(doc);
      });
    });
  }

  async findByCourseId(courseId) {
    return new Promise((resolve, reject) => {
      this.db.find({ courseId }, (err, docs) => {
        if (err) {
          logger.error(
            { err, op: "findByCourseId", courseId },
            "Failed to find by courseId"
          );
          return reject(err);
        }
        logger.info(
          { op: "findByCourseId", courseId, count: docs.length },
          "Found classes by course"
        );
        resolve(docs);
      });
    });
  }

  async findByStartDateRange(startDate, endDate) {
    return new Promise((resolve, reject) => {
      this.db.find(
        { startDateTime: { $gte: startDate, $lte: endDate }, active: { $ne: false } },
        (err, docs) => {
          if (err) {
            logger.error(
              { err, op: "findByStartDateRange", startDate, endDate },
              "Failed to find by range"
            );
            return reject(err);
          }
          logger.info(
            { op: "findByStartDateRange", count: docs.length },
            "Loaded by date range"
          );
          resolve(docs);
        }
      );
    });
  }

  async addAttendee(id, attendee) {
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then(classDoc => {
          // Check if already registered
          const existingAttendee = classDoc.attendees.find(
            (existing) => existing.email === attendee.email
          );
          if (existingAttendee) {
            logger.warn(
              { op: "addAttendee", id, attendeeEmail: attendee.email },
              "Already registered attendee"
            );
            return reject("Already registered");
          }
  
          this.db.update(
            { _id: id },
            { $push: { attendees: attendee } },
            {},
            (err) => {
              if (err) {
                logger.error(
                  { err, op: "addAttendee", id, attendee },
                  "Failed to add attendee"
                );
                return reject(err);
              }
              logger.info({ op: "addAttendee", id, attendee }, "Added attendee");
              this.db.persistence.compactDatafile();
              resolve("Success");
            }
          );
        })
        .catch(err => {
          logger.error({ err, op: "addAttendee", id, attendee }, "Failed to add attendee");
          reject(err);
        });
    });
  }

  async removeAttendee(id, email) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $pull: { attendees: { email } } },
        {},
        (err, numAffected) => {
          if (err) {
            logger.error(
              { err, op: "removeAttendee", id, email },
              "Failed to remove attendee"
            );
            return reject(err);
          }
  
          if (numAffected > 0) {
            logger.info({ op: "removeAttendee", id, email }, "Removed attendee");
            this.db.persistence.compactDatafile();
            resolve("Success");
          } else {
            logger.warn({ op: "removeAttendee", id, email }, "No attendee found to remove");
            resolve("Not Found");
          }
        }
      );
    });
  }

  // Moves classes to inactive
  async cancel(id) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: id }, { $set: { active: false } }, {}, (err) => {
        if (err) {
          logger.error({ err, op: "cancel", id }, "Failed to cancel class");
          return reject(err);
        }
        logger.info({ op: "cancel", id }, "Cancelled class");
        this.db.persistence.compactDatafile();
        resolve("Success");
      });
    });
  }

  // Updates a field
  async updateField(id, field, value) {
    return new Promise((resolve, reject) => {
      const update = { $set: { [field]: value } };
      this.db.update({ _id: id }, update, {}, (err) => {
        if (err) {
          logger.error({ err, op: "updateField", id, field }, "Failed to update class field");
          return reject(err);
        }
        logger.info({ op: "updateField", id, field, value }, "Updated class field");
        this.db.persistence.compactDatafile();
        resolve("Success");
      });
    });
  }
}

module.exports = new ClassDAO();
