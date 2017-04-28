let mongoose = require('../modules/db'),
    Schema = mongoose.Schema,
    Counter = require('./Counter'),
    _ = require('lodash');

let User = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    group: {
        type: Number,
        required: true,
        default: 0,
        index: true
    }
});

User.post('save', (doc, next) => {
    return Counter.methods.getNextSequence()
        .then(seq => doc.update({group: Math.floor((seq - 1) / 20) + 1}))
        .then(() => next());
});

let UserModel = mongoose.model('User', User);

let service = {
    model: UserModel,
    methods: {
        increment: (id, score) => {
            return UserModel.findOneAndUpdate({id: id}, {$inc: {score: score}})
                .then(result => {
                    if (result) return true;
                    return UserModel.create({id: id, score: score}).then(model => true);
                });
        },
        rank: (id) => {
            return UserModel.findOne({id: id})
                .then(user => {
                    if (user) {
                        return UserModel.aggregate([
                                {$match: {group: user.group}},
                                {$group: {_id: {score: {$sum: '$score'}}}},
                                {$sort: {score: -1}}
                            ])
                            .then(result => {
                                let place = null;
                                result.forEach((item, index) => {
                                    if (user.score === item._id.score) {
                                        place = index + 1;
                                        return false;
                                    }
                                });
                                return {score: user.score, place: place}
                            })
                            .catch(err => err);
                    } else {
                        return null;
                    }
                })
                .then(result => result)
                .catch(err => err);
        },
        winners: () => {
            let data = {};

            data.map = function () {
                emit(this.group, {id: this.id, score: this.score})
            };

            data.reduce = function (key, values) {
                let maxScore = Math.max.apply(null, values.map(value => {return value.score}));

                return {id:values
                        .filter(value => {return value.score === maxScore})
                        .map(value => {return value.id})
                    , score: maxScore};
            };

            return UserModel.mapReduce(data)
                .then(result => {
                    return _.map(result, item => {
                        return {group: item._id, users: _.flattenDeep(item.value.id)};
                        }
                    );
                });
        }
    }
};

module.exports = service;