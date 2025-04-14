const Datastore = require("gray-nedb");
const bcrypt = require("bcryptjs");

class UserDAO {
  constructor() {
    this.db = new Datastore({ filename: "./db/users.db", autoload: true });
  }

  async createUser({ name, email, password }) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) throw new Error("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      // default role for new users
      role: "unapproved_organiser",
    };

    return new Promise((resolve, reject) => {
      this.db.insert(newUser, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ email }, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  async updateRole(userId, newRole) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: userId },
        { $set: { role: newRole } },
        {},
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  async updatePassword(userId, newPassword) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: userId },
        { $set: { password: newPassword } },
        {},
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  async getAllOrganisers() {
    return new Promise((resolve, reject) => {
      this.db.find({ role: "organiser" }, (err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  }

  async getAllUnapprovedOrganisers() {
    return new Promise((resolve, reject) => {
      this.db.find({ role: "unapproved_organiser" }, (err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  }

}

module.exports = new UserDAO();
