let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/service', {}, err => {
    if (err) {
        console.error(err);
        return process.exit(1);
    }

    return require('../../models/Counter').methods.findOrCreate();
});

let db = mongoose.connection;

db.on('error', err => console.log('Connection error: ', err.message));
db.once('open', () => console.log('Connected to DB'));

module.exports = mongoose;