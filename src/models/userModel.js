const nedb = require('nedb');

class userModel {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    create(data) {
        return new Promise((resolve, reject) => {
            this.db.insert(data, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    read(data) {
        return new Promise((resolve, reject) => {
            this.db.find(data, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    update(data, newData) {
        return new Promise((resolve, reject) => {
            this.db.update(data, newData, {}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    delete(data) {
        return new Promise((resolve, reject) => {
            this.db.remove(data, {}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }
}