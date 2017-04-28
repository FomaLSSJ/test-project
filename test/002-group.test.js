let app = require('../app'),
    chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    chaiHttp = require('chai-http'),
    User = require('../models/User');

chai.use(chaiHttp);

describe('Group methods', () => {
    it('Reset all', () => {
        return chai.request(app)
            .post('/reset_ratings')
            .send()
            .then(res => {
                assert.typeOf(res.body, 'object');
                res.should.have.status(200);
                res.body.should.have.property('success').and.equal(true);
            });
    });
});

