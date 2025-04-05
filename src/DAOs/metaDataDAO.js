const Datastore = require("gray-nedb");

class MetadataDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/metadata.db", autoload: true });
  }

  async getNextCourseId() {
    const tracker = await this._getOrCreateSingleTracker("course_id_tracker", "CO001");
    const nextId = tracker.nextId;
    const next = this._incrementId(nextId, "CO");
    await this._updateTrackerId("course_id_tracker", next);
    return nextId;
  }

  async getNextClassId() {
    const tracker = await this._getOrCreateSingleTracker("class_id_tracker", "CL001");
    const nextId = tracker.nextId;
    const next = this._incrementId(nextId, "CL");
    await this._updateTrackerId("class_id_tracker", next);
    return nextId;
  }

  _incrementId(currentId, prefix) {
    const num = parseInt(currentId.replace(prefix, ""), 10) + 1;
    return `${prefix}${String(num).padStart(3, "0")}`;
  }

  _getOrCreateSingleTracker(trackerId, initialValue) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: trackerId }, (err, tracker) => {
        if (err) return reject(err);
        if (tracker) return resolve(tracker);

        this.db.insert({ _id: trackerId, nextId: initialValue }, (insertErr, newTracker) => {
          if (insertErr?.errorType === "uniqueViolated") {
            this.db.findOne({ _id: trackerId }, (retryErr, existingTracker) => {
              if (retryErr) return reject(retryErr);
              resolve(existingTracker);
            });
          } else if (insertErr) {
            return reject(insertErr);
          } else {
            resolve(newTracker);
          }
        });
      });
    });
  }

  _updateTrackerId(trackerId, nextId) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: trackerId }, { $set: { nextId } }, {}, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = new MetadataDAO();
