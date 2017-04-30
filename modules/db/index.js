let mongoose = require('mongoose'),
    host = process.env.MONGO_HOST || 'localhost',
    port = process.env.MONGO_PORT || '27017',
    database = process.env.MONGO_DB || 'test';

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${host}:${port}/${database}`, {}, err => {
    if (err) {
        console.error(err);
        return process.exit(1);
    }

    if (database !== 'test') return require('../../models/Counter').methods.findOrCreate();
});

let db = mongoose.connection;

db.on('error', err => {
    return console.error('Connection error:', err.message);
});
db.once('open', () => {
    if (database !== 'test') {
        return console.log('Connected to DB:', database);
    }
});

module.exports = mongoose;