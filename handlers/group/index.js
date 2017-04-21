let service = {
    reset: (req, res) => {
        return res.json({success: true, method: 'rating'});
    }
};

module.exports = service;