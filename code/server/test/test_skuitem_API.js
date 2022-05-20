const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const skuitem = require('../warehouse/skuitem');
const sku = require('../warehouse/sku');

const skuitem1 = {
    RFID: "12345678901234567890123456789014",
    SKUId: 47947394739, 
    Available: 0,
    DateOfStock: "2021/11/29 12:30"
}

const skuitem2 = {
    RFID: "99945678901234567890123456789014",
    SKUId: 767667, //lo riassegno nel before()
    Available: 0,
    DateOfStock: "2021/11/29 12:30"
}

const skuitem3 = {
    RFID: "88845678901234567890123456789014",
    SKUId: 767667, //lo riassegno nel before()
    Available: 0,
    DateOfStock: "2021/11/29 12:30"
}

const skuitem4 = {
    RFID: "88945678901234567890123456789014",
    SKUId: 999999, //lo riassegno nel before()
    Available: 0,
    DateOfStock: "2021/11/29 12:30"
}

const skuitem5 = {
    RFID: "55945678901234567890123456789014",
    SKUId: 999999, //lo riassegno nel before()
    Available: 0,
    DateOfStock: "2021/11/29 12:30"
}

const sku1 = {
    description: "nuovo sku da API testing",
    weight: 88,
    volume: 88,
    notes: "sku numero 1",
    availableQuantity: 88,
    price: 88.88
}

const sku2 = {
    description: "nuovo sku da API testing",
    weight: 88,
    volume: 88,
    notes: "sku numero 1",
    availableQuantity: 88,
    price: 88.88
}

const wrongSkuitem1 = {
    RFID: "73639934764565465678901234567890123456789015", //ha piu di 32 caratteri
    SKUId: 1,
    Available: 0,
    DateOfStock: "2021/11/29 12:30"
}

const wrongSkuitem2 = {
    RFID: "88845678901234567890123456789015",
    SKUId: 1,
    Available: 0,
    DateOfStock: "2021/11/2926 12:30" //data nel formato sbagliato
}

const setAvailableSkuitem2 = {
    "RFID": "99945678901234567890123456789014",
    "newRFID": "99945678901234567890123456789014",
    "newAvailable": 1,
    "newDateOfStock": "2021/11/29 12:30",
};

const setAvailableSkuitem5 = {
    "RFID": "55945678901234567890123456789014",
    "newRFID": "55945678901234567890123456789014",
    "newAvailable": 1,
    "newDateOfStock": "2021/11/29 12:30",
};

const modifySkuitem2 = {
    "RFID": "99945678901234567890123456789014",
    "newRFID": "10000678901234567890123456789015",
    "newAvailable": 1,
    "newDateOfStock": "2028/11/29 19:30",
};

const modifySkuitem5 = {
    "RFID": "55945678901234567890123456789014",
    "newRFID": "55945678901234567890123456789014",
    "newAvailable": 1,
    "newDateOfStock": "2028/11/29 19:30",
};

const modifySkuitemWrong = {
    "RFID": "0000037374", //ha meno di 32 caratteri!!
    "newRFID": "000003737", 
    "newAvailable": 1,
    "newDateOfStock": "2028/11/29 19:30",
};

const modifySkuitemWrong2 = {
    "RFID": "99945678901234567890123456789014",
    "newRFID": "99945678901234567890123456789014", 
    "newAvailable": 1,
    "newDateOfStock": "2028/11/29 19:3090", //formato data sbagliato
};

describe('test skuitem apis', () => {

    before(async () => {
        await skuitem.deleteAllSkuitems();
        await sku.deleteAllSkus();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
        let skus = await sku.getStoredSkus();
        this.SKUId1 = skus[0].id;
        this.SKUId2 = skus[1].id;
        skuitem2.SKUId = this.SKUId1;
        skuitem3.SKUId = this.SKUId1;
        skuitem5.SKUId = this.SKUId1;
        skuitem4.SKUId = this.SKUId2; //ASSCOCIATO A UN DIFFERENTE SKU RISPETTO AI PRECEDENTI
        wrongSkuitem1.SKUId = this.SKUId1;
        wrongSkuitem2.SKUId = this.SKUId1;
    });

    getNonExistingSkuitem(404, skuitem1); //skuitem1 non esiste ancora nel DB
    storeSkuitemNotAssociatedToSku(404, skuitem1); //NON puo essere inserito: manca lo sku corrispondente
    storeSkuitem(201, skuitem2); //inserito correttamente
    getSkuitem(200, skuitem2); //ritornato correttamente
    storeSkuitem(500, skuitem2); //DUPLICATO ==> ERRORE 
    storeSkuitem(422, wrongSkuitem1); //FORMATO RFID SBAGLIATO ==> ERRORE 
    storeSkuitem(422, wrongSkuitem2); //FORMATO DATA SBAGLIATO ==> ERRORE 
    storeSkuitem(201, skuitem3); //inserito correttamente
    storeSkuitem(201, skuitem4); //inserito correttamente
    storeSkuitem(201, skuitem5); //inserito correttamente
    getMultipleSkuitems(200, [skuitem2, skuitem3, skuitem4, skuitem5]); //skuitem2 e skuitem3 e skuitem4 ritornati
    modifySkuitemAndCheck(200, setAvailableSkuitem2); //modifico skuitem2 (setto available) e controllo modifiche
    modifySkuitemAndCheck(200, setAvailableSkuitem5); //modifico skuitem5 (setto available) e controllo modifiche
    getMultipleSkuitemsWithSkuidAndAvailable(200,[skuitem2,skuitem5]); //torna solo quelli con il dato SKUID e AVAILABLE=1
    modifySkuitemAndCheck(200, modifySkuitem2); //modifico skuitem2 e controllo modifiche
    modifySkuitemAndCheck(200, modifySkuitem5); //modifico skuitem5 e controllo modifiche
    getSkuitem(200, skuitem3); //ritornato correttamente
    deleteSkuitem(204, skuitem3); //elimino item1
    getNonExistingSkuitem(404, skuitem3); //controllo che sia stato eliminato
    modifySkuitem(404, modifySkuitem2); //skuitem2 non esiste piu
    modifySkuitem(422, modifySkuitemWrong); //FORMATO SBAGLIATO ==> ERRORE 
    modifySkuitem(422, modifySkuitemWrong2); //FORMATO SBAGLIATO ==> ERRORE 

    function storeSkuitemNotAssociatedToSku(expectedHTTPStatus, data) {
        it('store skuitem not associated to sku', function (done) {
            agent.post('/api/skuitem')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function storeSkuitem(expectedHTTPStatus, data) {
        it('store skuitem', function (done) {
            agent.post('/api/skuitem')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function getSkuitem(expectedHTTPStatus, data) {
        it('get skuitem', function (done) {
            agent.get('/api/skuitems/' + data.RFID)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    r.body.RFID.should.equal(data.RFID);
                    r.body.SKUId.should.equal(data.SKUId);
                    r.body.Available.should.equal(data.Available);
                    r.body.DateOfStock.should.equal(data.DateOfStock);
                    done();
                });
        });
    }

    function getMultipleSkuitems(expectedHTTPStatus, data) {
        it('get multiple skuitems', function (done) {
            agent.get('/api/skuitems')
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    for (let i = 0; i < r.body.length; ++i) {
                        r.body[i].RFID.should.equal(data[i].RFID);
                        r.body[i].SKUId.should.equal(data[i].SKUId);
                        r.body[i].DateOfStock.should.equal(data[i].DateOfStock);
                        r.body[i].Available.should.equal(data[i].Available);
                    }
                    done();
                });
        });
    }

    function getMultipleSkuitemsWithSkuidAndAvailable(expectedHTTPStatus, data) {
        it('get multiple skuitems with a certain skuid and available', function (done) {
            agent.get('/api/skuitems/sku/'+skuitem2.SKUId)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    for (let i = 0; i < r.body.length; ++i) {
                        r.body[i].RFID.should.equal(data[i].RFID);
                        r.body[i].SKUId.should.equal(data[i].SKUId);
                        r.body[i].DateOfStock.should.equal(data[i].DateOfStock);
                    }
                    done();
                });
        });
    }

    function getNonExistingSkuitem(expectedHTTPStatus, data) {
        it('get non existing sku item', function (done) {
            agent.get('/api/skuitems/' + data.RFID)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function modifySkuitemAndCheck(expectedHTTPStatus, data) {
        it('modify skuitem and check', function (done) {
            agent.put('/api/skuitems/' + data.RFID)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    agent.get('/api/skuitems/' + data.newRFID)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.RFID.should.equal(data.newRFID);
                            r.body.Available.should.equal(data.newAvailable);                            r.body.Available.should.equal(data.newAvailable);
                            r.body.DateOfStock.should.equal(data.newDateOfStock);
                            done();
                        });
                });
        });
    }

    function modifySkuitem(expectedHTTPStatus, data) {
        it('modify skuitem', function (done) {
            agent.put('/api/skuitems/' + data.RFID)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function deleteSkuitem(expectedHTTPStatus, data) {
        it('delete skuitem', function (done) {
            agent.delete('/api/skuitems/' + data.RFID)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }
});