let router = require('express').Router(),
    userHandle = require('../../handlers/user'),
    groupHandle = require('../../handlers/group');

router.get('/get_rank', userHandle.rank);
router.get('/get_winners', userHandle.winners);

router.post('/inc_scores', userHandle.increment);
router.post('/reset_ratings', groupHandle.reset);

module.exports = router;