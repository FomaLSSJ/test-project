let User = require('../../models/User');

let servive = {
    increment: (req, res) => {
        let id = req.body.id,
            score = req.body.score;

        return User.methods.increment(id, score)
            .then(result => res.json({success: true, result: result}))
            .catch(err => res.json({success: false, result: err}));
    },
    rank: (req, res) => {
        let id = req.query.id;

        return User.methods.rank(id)
            .then(result => res.json({success: true, result: result}))
            .catch(err => res.json({success: false, result: err}));
    },
    winners: (req, res) => {
        return res.json({success: true, method: 'winners'});
    }
};

module.exports = servive;