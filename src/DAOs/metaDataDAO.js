const Datastore = require("gray-nedb");

class MetadataDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/metadata.db", autoload: true });
  }

  // Retrieve and increment the next available course ID
  async getNextCourseId() {
    const doc = await this._getOrInitializeTracker();
    const nextCourseId = doc.nextCourseId;
    const nextCourseNumber = parseInt(nextCourseId.replace("CO", "")) + 1;
    const newCourseId = `CO${String(nextCourseNumber).padStart(3, "0")}`;

    await this.updateNextCourseId(newCourseId);
    return newCourseId;
  }

  // Retrieve and increment the next available class ID
  async getNextClassId() {
    const doc = await this._getOrInitializeTracker();
    const nextClassId = doc.nextClassId;
    const nextClassNumber = parseInt(nextClassId.replace("CL", "")) + 1;
    const newClassId = `CL${String(nextClassNumber).padStart(3, "0")}`;

    await this.updateNextClassId(newClassId);
    return newClassId;
  }

  // Initialize the metadata collection if it doesn't exist
  async _getOrInitializeTracker() {
    let doc = await this._findTracker();
    if (!doc) {
      doc = await this._initializeMetadata();
    }
    return doc;
  }

  // Find the tracker document
  _findTracker() {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: "id_tracker" }, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }

  // Initialize the metadata collection
  _initializeMetadata() {
    return new Promise((resolve, reject) => {
      this.db.insert({ _id: "id_tracker", nextCourseId: "CO001", nextClassId: "CL001" }, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      });
    });
  }

  // Update the next available course ID
  updateNextCourseId(nextCourseId) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: "id_tracker" }, { $set: { nextCourseId } }, {}, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // Update the next available class ID
  updateNextClassId(nextClassId) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: "id_tracker" }, { $set: { nextClassId } }, {}, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

module.exports = new MetadataDAO();