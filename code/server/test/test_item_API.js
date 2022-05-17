const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const item = require('../warehouse/item');

const item1 = {
    id: 1,
    description: "new item from test API",
    price: 7.77,
    SKUId: 1,
    supplierId: 2
};

describe('test item apis', () => {

    before(async () => {
        await item.deleteAllItems();
    });

    getNonExistingItem(404, item1);
    storeItem(201, item1);
    getItem(200, item1);

});

function storeItem(expectedHTTPStatus, data) {
    it('store item', function (done) {
        agent.post('/api/item')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getItem(expectedHTTPStatus, data) {
    it('get item', function (done) {
        agent.get('/api/items/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.equal(data.id);
                r.body.description.should.equal(data.description);
                r.body.price.should.equal(data.price);
                r.body.SKUId.should.equal(data.SKUId);
                r.body.supplierId.should.equal(data.supplierId);
                done();
            });
    });
}

function getNonExistingItem(expectedHTTPStatus, data) {
    it('get non existing item', function (done) {
        agent.get('/api/items/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

