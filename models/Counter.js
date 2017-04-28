let mongoose = require('../modules/db'),
    Schema = mongoose.Schema;

let Counter = new Schema({
    _id: {
        type: Schema.Types.Mixed,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        required: true,
        unique: true
    }
});

let CounterModel = mongoose.model('Counter', Counter);

let service = {
    model: CounterModel,
    methods: {
        getNextSequence: () => {
            return CounterModel.findOneAndUpdate({_id: 'userid'}, {$inc: {seq: 1}}, {new: true})
                .then(model => model.seq)
                .catch(err => console.error(err));
        },
        findOrCreate: () => {
            return CounterModel.findOne({_id: 'userid'})
                .then(model => {
                    if (model) return model;

                    let counter = new CounterModel({_id: 'userid', seq: 0});
                    return counter.save();
                })
        }
    }
};

module.exports = service;