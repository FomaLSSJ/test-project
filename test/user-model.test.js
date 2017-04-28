process.env.NODE_ENV = 'test';

let app = require('../app'),
    chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http'),
    _ = require('lodash'),
    User = require('../models/User'),
    Counter = require('../models/Counter');

chai.use(chaiHttp);

describe('User model', () => {
    it('Make model', () => {
        return User.model.create({
            users: [{
                id: 'Vasyan',
                score: 0
            }, {
                id: 'Valera',
                score: -30
            }, {
                id: 'Seryoga',
                score: 255
            }]
        }).then(model => {
            console.log(model);
            return model.should.have.property('_id');
        }).then(() => true).catch(err => console.error(err));
    });

    it('huit', () => {
        let promises = [];
        for (i = 0; i < 400; i++) {
            let id = Date.now() * Math.random() * 9999 * Math.random() * 9999;
            promises.push(User.methods.increment(id, 5));
        }
        return Promise.all(promises).then(data => console.log(!_.isEmpty(data)));
    });

    it('Increment user score', () => {
        return User.methods.increment('Kek', 10)
            .then(result => console.log(result)).catch(err => console.error(err));
    });

    it('Get models', () => {
       return User.model.find()
           .then(models => {
               return console.log(models);
           }).then(() => true).catch(err => console.error(err));
    });

    it('Drop collection', () => {
        return Promise.all([
            User.model.remove(),
            Counter.model.remove()
        ]).then(() => Counter.methods.findOrCreate()).then(() => true);
    });

    it('Counter init', () => {
        return Counter.methods.findOrCreate()
            .then(counter => {
                if (counter.seq !== 0) return counter.update({seq: 0});
                return counter;
            });
    });

    it('Get rank', () => {
        return User.methods.rank('33745637975245427000')
            .then(data => console.log(data));
    });

    it('Get winners', () => {
        return User.methods.winners()
            .then(result => console.log(result));
    });
});
