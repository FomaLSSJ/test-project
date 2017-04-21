let servive = {
    increment: (req, res) => {
        return res.json({success: true, method: 'scores'});
    },
    rank: (req, res) => {
        return res.json({success: true, method: 'rank'});
    },
    winners: (req, res) => {
        return res.json({success: true, method: 'winners'});
    }
};

module.exports = servive;