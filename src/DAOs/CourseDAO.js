const Datastore = require("gray-nedb");
const classDAO = require("./ClassDAO");
const logger = require("pino")();

class CourseDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/courses.db", autoload: true });
  }

  async insert(course) {
    return new Promise((resolve, reject) => {
      this.db.insert(course, (err, newDoc) => {
        if (err) {
          logger.error(
            { err, op: "insert", collection: "courses" },
            "DB insert failed"
          );
          return reject(err);
        }
        logger.info(
          { op: "insert", collection: "courses", data: newDoc },
          "Inserted course"
        );
        // Clean up database
        this.db.persistence.compactDatafile();
        resolve(newDoc);
      });
    });
  }

  async updateClassIds(courseId, classIds) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: courseId },
        { $set: { classIds } },
        {},
        (err, count) => {
          if (err) {
            logger.error(
              { err, op: "updateClassIds", courseId },
              "Failed to update classIds"
            );
            return reject(err);
          }
          logger.info(
            { op: "updateClassIds", courseId, classIds },
            "Updated classIds"
          );
          // Clean up database
          this.db.persistence.compactDatafile();
          resolve(count);
        }
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) {
          logger.error({ err, op: "findById", id }, "Failed to find course");
          return reject(err);
        }
        logger.info({ op: "findById", id }, "Found course");
        resolve(doc);
      });
    });
  }

  async findByOrganiserId(organiserId) {
    return new Promise((resolve, reject) => {
      this.db.find({ organisers: organiserId }, (err, docs) => {
        if (err) {
          logger.error(
            { err, op: "findByOrganiserId", organiserId },
            "Failed to find courses by organiser ID"
          );
          return reject(err);
        }
        logger.info(
          { op: "findByOrganiserId", organiserId, count: docs.length },
          "Found courses for organiser"
        );
        resolve(docs);
      });
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) {
          logger.error({ err, op: "findAll" }, "Failed to read all courses");
          return reject(err);
        }
        logger.info({ op: "findAll", count: docs.length }, "Read all courses");
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
            "Failed to read active courses"
          );
          return reject(err);
        }
        logger.info(
          { op: "findActive", count: docs.length },
          "Read active courses"
        );
        resolve(docs);
      });
    });
  }

  async addAttendee(id, attendee) {
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then((course) => {
          // Check if already registered
          const existingAttendee = course.attendees.find(
            (existing) => existing.email === attendee.email
          );
          if (existingAttendee) {
            logger.warn(
              { op: "addAttendee", id, attendeeEmail: attendee.email },
              "Attendee already registered"
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
              logger.info(
                { op: "addAttendee", id, attendee },
                "Added attendee to course"
              );
              // Clean up database
              this.db.persistence.compactDatafile();
              resolve("Success");
            }
          );
        })
        .catch((err) => {
          logger.error(
            { err, op: "addAttendee", id, attendee },
            "Failed to add attendee"
          );
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
        (err) => {
          if (err) {
            logger.error(
              { err, op: "removeAttendee", id, email },
              "Failed to remove attendee"
            );
            return reject(err);
          }
          logger.info({ op: "removeAttendee", id, email }, "Removed attendee");
          // Clean up database
          this.db.persistence.compactDatafile();
          resolve("Success");
        }
      );
    });
  }

  // Moves course and all its classes to inactive
  async cancel(id) {
    const course = await this.findById(id);
    const classIds = course.classIds;
    if (Array.isArray(course.classIds)) {
      await Promise.all(classIds.map((classId) => classDAO.cancel(classId)));
    }
    return new Promise((resolve, reject) => {
      this.db.update({ _id: id }, { $set: { active: false } }, {}, (err) => {
        if (err) {
          logger.error(
            { err, op: "cancelCourse", id },
            "Failed to cancel course"
          );
          return reject(err);
        }
        logger.info(
          { op: "cancelCourse", id },
          "Course (and classes) cancelled"
        );
        // Clean up database
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
          logger.error(
            { err, op: "updateField", id, field },
            "Failed to update course field"
          );
          return reject(err);
        }
        logger.info(
          { op: "updateField", id, field, value },
          "Updated course field"
        );
        // Clean up database
        this.db.persistence.compactDatafile();
        resolve("Success");
      });
    });
  }

  async addOrganiser(courseId, organiserId) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: courseId },
        { $addToSet: { organisers: organiserId } },
        {},
        (err) => {
          if (err) {
            logger.error(
              { err, op: "addOrganiser", courseId, organiserId },
              "Failed to add organiser"
            );
            return reject(err);
          }
          logger.info(
            { op: "addOrganiser", courseId, organiserId },
            "Organiser added"
          );
          // Clean up database
          this.db.persistence.compactDatafile();
          resolve("Success");
        }
      );
    });
  }

  async removeOrganiser(courseId, organiserId) {
    return new Promise((resolve, reject) => {
      this.findById(courseId)
        .then((course) => {
          if (!course || !Array.isArray(course.organisers)) {
            return reject("Course not found or organisers missing");
          }

          // Reject if only one organiser remaining
          if (course.organisers.length <= 1) {
            return reject("Cannot remove the only organiser");
          }

          this.db.update(
            { _id: courseId },
            { $pull: { organisers: organiserId } },
            {},
            (err) => {
              if (err) {
                logger.error(
                  { err, op: "removeOrganiser", courseId, organiserId },
                  "Failed to remove organiser"
                );
                return reject(err);
              }
              logger.info(
                { op: "removeOrganiser", courseId, organiserId },
                "Organiser removed"
              );
              // Clean up database
              this.db.persistence.compactDatafile();
              resolve("Success");
            }
          );
        })
        .catch((err) => {
          logger.error(
            { err, op: "removeOrganiser", courseId, organiserId },
            "Error during removal"
          );
          reject(err);
        });
    });
  }
}

module.exports = new CourseDAO();
