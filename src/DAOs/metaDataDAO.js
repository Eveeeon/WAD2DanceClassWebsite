// Used to track the most recent course and class IDs to ensure uniqueness
const Datastore = require('nedb');

export class MetadataDAO {
  constructor() {
    this.db = new Datastore({ filename: 'metadata.db', autoload: true });
  }

  // Retrieve and increment the next available course ID
  async getNextCourseId() {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: 'id_tracker' }, async (err, doc) => {
        if (err) reject(err);
        if (!doc) {
          // If not found, initialize with default values
          await this.initializeMetadata();
          doc = await this.db.findOne({ _id: 'id_tracker' });
        }
        
        // Increment the next ID
        const nextCourseId = doc.nextCourseId;
        const nextCourseNumber = parseInt(nextCourseId.replace('CO', '')) + 1;
        const newCourseId = `CO${String(nextCourseNumber).padStart(3, '0')}`;
        await this.updateNextCourseId(newCourseId);
        resolve(newCourseId);
      });
    });
  }

  // Retrieve and increment the next available class ID
  async getNextClassId() {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: 'id_tracker' }, async (err, doc) => {
        if (err) reject(err);
        if (!doc) {
          // If notfound, initialize with a default values
          await this.initializeMetadata();
          doc = await this.db.findOne({ _id: 'id_tracker' });
        }

        // Increment the next ID
        const nextClassId = doc.nextClassId;
        const nextClassNumber = parseInt(nextClassId.replace('CL', '')) + 1;
        const newClassId = `CL${String(nextClassNumber).padStart(3, '0')}`;
        await this.updateNextClassId(newClassId);

        resolve(newClassId);
      });
    });
  }

  // Initialize the metadata collection if it doesn't exist
  async initializeMetadata() {
    return new Promise((resolve, reject) => {
      this.db.insert({ _id: 'id_tracker', nextCourseId: 'CO001', nextClassId: 'CL001' }, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      });
    });
  }

  // Update the next available course ID
  async updateNextCourseId(nextCourseId) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: 'id_tracker' },
        { $set: { nextCourseId } },
        {},
        (err, numReplaced) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  // Update the next available class ID
  async updateNextClassId(nextClassId) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: 'id_tracker' },
        { $set: { nextClassId } },
        {},
        (err, numReplaced) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }
}

module.exports = MetadataDAO;
