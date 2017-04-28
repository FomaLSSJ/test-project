let app = require('../app'),
    chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    User = require('../models/User'),
    Counter = require('../models/Counter');

describe('Init database', () => {
    it('Drop users collection', () => {
       return User.model.remove()
           .then(() => User.model.find())
           .then(models => {
               assert.typeOf(models, 'array');
               models.should.have.property('length').and.equal(0);
           });
    });

    it('Drop and re-init sequence', () => {
        return Counter.methods.findOrCreate()
            .then(model => {
                assert.typeOf(model, 'object');
                model.should.have.property('_id');
                model.should.have.property('seq');
                if (model.seq !== 0) {
                    model.seq = 0;
                    return model.save();
                }
                return model;
            })
            .then(model => {
                model.should.have.property('seq').and.equal(0);
            });
    });
});