let app = require('../app'),
    chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    chaiHttp = require('chai-http'),
    _ = require('lodash'),
    User = require('../models/User');

chai.use(chaiHttp);

let checkPlace = (increment, place) => {
    let defaultScore = null;

    return chai.request(app)
        .get('/get_rank')
        .query({id: 10})
        .then(res => {
            defaultScore = res.body.result.score;
            assert.typeOf(res.body, 'object');
            res.should.have.status(200);
            res.body.should.have.property('success').and.equal(true);
            res.body.result.should.have.property('score');
            res.body.result.should.have.property('place');

            return chai.request(app).post('/inc_scores').send({id: 10, score: increment});
        })
        .then(res => {
            assert.typeOf(res.body, 'object');
            res.should.have.status(200);
            res.body.should.have.property('success').and.equal(true);
            res.body.result.should.have.property('score').and.equal(defaultScore + increment);

            return chai.request(app).get('/get_rank').query({id: 10});
        })
        .then(res => {
            assert.typeOf(res.body, 'object');
            res.should.have.status(200);
            res.body.should.have.property('success').and.equal(true);
            place.should.to.include(res.body.result.place);
        });
};

describe('User methods', () => {
    it('Increment 50 users', () => {
        let promises = [];

        for (let i = 0; i < 50; i++) {
            let id = i + 1,
                score = i + 2;

            promises.push(chai.request(app).post('/inc_scores').send({id: id, score: score}));
        }

        return Promise.all(promises)
            .then(data => {
                data.forEach((item, i) => {
                    let id = i + 1,
                        score = i + 2;

                    assert.typeOf(item.body, 'object');
                    item.should.have.status(200);
                    item.body.should.have.property('success').and.equal(true);
                    item.body.result.should.have.property('id').and.equal(id.toString());
                    item.body.result.should.have.property('score').and.equal(score);
                });
            });
    });

    it('Get users rank', () => {
        let ids = [1, 25, 50];
        let promises = [
            chai.request(app).get('/get_rank').query({id: ids[0]}),
            chai.request(app).get('/get_rank').query({id: ids[1]}),
            chai.request(app).get('/get_rank').query({id: ids[2]})
        ];

        return Promise.all(promises)
            .then(data => {
                data.forEach((item, i) => {
                    assert.typeOf(item, 'object');
                    item.should.have.status(200);
                    item.body.should.have.property('success').and.equal(true);
                    item.body.result.should.have.property('score').and.equal(ids[i] + 1);
                });
            });
    });

    it('User lower place', () => {
        let incrementScore = -50;

        return checkPlace(incrementScore, [10, 20]);
    });

    it('User upper place', () => {
        let incrementScore = 100;

        return checkPlace(incrementScore, [1]);
    });

    it('Get winners', () => {
        return Promise.all([
                User.model.aggregate([
                    {$group: {
                        _id: {group: {$sum: '$group'}},
                        userItems: {$push: {id: '$id', score: '$score'}}
                    }}
                ]),
                chai.request(app).get('/get_winners').query()
            ])
            .then(([result, res]) => {
                let sorted = _.reverse(_.map(result, item => {
                    return {
                        group: item._id.group,
                        max: _.maxBy(item.userItems, x => x.score)
                    };
                }));
                assert.typeOf(res.body, 'object');
                res.should.have.status(200);
                res.body.should.have.property('success').and.equal(true);
                res.body.result[0].users[0].should.equal(sorted[0].max.id);
                res.body.result[1].users[0].should.equal(sorted[1].max.id);
                res.body.result[2].users[0].should.equal(sorted[2].max.id);
            });
    });
});