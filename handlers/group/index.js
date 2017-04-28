let User = require('../../models/User'),
    Counter = require('../../models/Counter');

let service = {
    reset: (req, res) => {
        return Promise.all([
                User.model.remove(),
                Counter.model.findOneAndUpdate({_id: 'userid'}, {seq: 0})
            ])
            .then(() => res.json({success: true}))
            .catch(err => res.json({success: false, result: err}));
    }
};

module.exports = service;