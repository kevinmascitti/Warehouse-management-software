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

const item2 = {
    id: 2,
    description: "another item from test API",
    price: 8.88,
    SKUId: 2,
    supplierId: 2
};

const wrongItem = {
    id: "DOVREBBE ESSERE UN NUMERO",
    description: "another item from test API",
    price: "8.88 SONO UNA STRINGA",
    SKUId: 2,
    supplierId: 2
};

const modifyItem1 = {
    id: 1,
    newDescription: "another item from test API",
    newPrice: 2.99,
};

const modifyItem2 = {
    id: 2,
    newDescription: "another item from test API",
    newPrice: 2.99,
};

const modifyItemWrong = {
    id: 'ciao, mi presento: non sono un numero',
    newDescription: "another item from test API",
    newPrice: 2.99,
};

describe('test item apis', () => {

    before(async () => {
        await item.deleteAllItems();
    });

    after(async () => {
        await item.deleteAllItems();
    });

    getNonExistingItem(404, item1); //item1 non esiste ancora nel DB
    storeItem(201, item1); //item1 inserito
    getItem(200, item1); //ritornato correttamente
    storeItem(201, item2); //item2 inserito
    storeItem(422, item2); //DUPLICATO ==> STESSO ITEM GIA VENDUTO DA STESSO SUPPLIER (ERROR 422) 
    storeItem(422, wrongItem); //FORMATO SBAGLIATO ==> ERRORE 
    getMultipleItems(200, [item1, item2]); //item1 e item2 ritornati
    modifyItemAndCheck(200, modifyItem1); //modifico item1 e controllo modifiche
    deleteItem(204, item2); //elimino item1
    getNonExistingItem(404, item2); //controllo che sia stato eliminato
    modifyItem(404, modifyItem2); //item2 non esiste piu
    modifyItem(422, modifyItemWrong); //FORMATO SBAGLIATO ==> ERRORE 
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

function getMultipleItems(expectedHTTPStatus, data) {
    it('get multiple items', function (done) {
        agent.get('/api/items')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body[i].id.should.equal(data[i].id);
                    r.body[i].description.should.equal(data[i].description);
                    r.body[i].price.should.equal(data[i].price);
                    r.body[i].SKUId.should.equal(data[i].SKUId);
                    r.body[i].supplierId.should.equal(data[i].supplierId);
                }
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

function modifyItemAndCheck(expectedHTTPStatus, data) {
    it('modify item and check', function (done) {
        agent.put('/api/item/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('/api/items/' + data.id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(data.id);
                        r.body.description.should.equal(data.newDescription);
                        r.body.price.should.equal(data.newPrice);
                        done();
                    });
            });
    });
}

function modifyItem(expectedHTTPStatus, data) {
    it('modify item', function (done) {
        agent.put('/api/item/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteItem(expectedHTTPStatus, data) {
    it('delete item', function (done) {
        agent.delete('/api/items/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}