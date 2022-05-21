const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const sku = require('../warehouse/sku');

const sku1 = {
    "description" : "first new sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "first SKU",
    "price" : 10.99,
    "availableQuantity" : 50,
    "testDescriptors" : []
}

const sku2 = {
    "description" : "second new sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "second SKU",
    "price" : 10.99,
    "availableQuantity" : 50,
    "testDescriptors" : []
}

const sku3 = {
    "description" : "third new sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "tihrd SKU",
    "price" : 10.99,
    "availableQuantity" : 50,
    "testDescriptors" : []
}

const wrongSku1 = {
    description: "primo sku errato da API testing",
    weight: -1, //DEVE ESSERE NON NEGATIVO
    volume: 88,
    notes: "sku errato 1",
    availableQuantity: 88,
    price: 88.88
}

const wrongSku2 = {
    description: "secondo sku errato da API testing",
    weight: 5,
    volume: 88,
    notes: "sku errato 1",
    availableQuantity: 88,
    price: -0.01 //DEVE ESSERE NON NEGATIVO
}

const setAvailableSkuitem2 = {
    "RFID": "99945678901234567890123456789014",
    "newRFID": "99945678901234567890123456789014",
    "newAvailable": 1,
    "newDateOfStock": null,
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
    "newDateOfStock": null,
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

describe('test sku apis', () => {

    before(async () => {
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
    });

    after(async () => {
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
    });

    getNonExistingSku(404, 3); //sku3 NON esiste ancora nel DB
    getNonExistingSku(200, 1); //sku1 ESISTE ancora nel DB
    getNonExistingSku(200, 2); //sku2 ESISTE ancora nel DB
    //storeSkuitemNotAssociatedToSku(404, skuitem1); //NON puo essere inserito: manca lo sku corrispondente
    storeSku(201, sku3); //inserito correttamente
    getNonExistingSku(200, 3); //sku3 ORA esiste ancora nel DB
    getSku(200, sku3, 3); //controllo se ritornato correttamente
    getSku(200, sku2, 2); //controllo se ritornato correttamente
    getSku(200, sku1, 1); //controllo se ritornato correttamente
    getNonExistingSku(422, sku1, sku1.notes); //FORMATO ID ERRATO: NON NUMERICO!!
    storeSku(422, wrongSku1); //FORMATO weight SBAGLIATO ==> ERRORE 
    storeSku(422, wrongSku2); //FORMATO price SBAGLIATO ==> ERRORE 
    getMultipleSkus(200, [sku1, sku2, sku3]); //sku1 e skuitem3 e sku3 ritornati
    //modifySkuitemAndCheck(200, setAvailableSkuitem5); //modifico skuitem5 (setto available) e controllo modifiche
    //getMultipleSkuitemsWithSkuidAndAvailable(200,[skuitem2,skuitem5]); //torna solo quelli con il dato SKUID e AVAILABLE=1
    //modifySkuitemAndCheck(200, modifySkuitem2); //modifico skuitem2 e controllo modifiche
    deleteSku(422, sku2.notes); //FORMATO ID ERRATO: NON NUMERICO!!
    getSku(200, sku2, 2); //controllo se ritornato correttamente
    deleteSku(204, 2); //elimino sku2
    getNonExistingSku(404, 2); //controllo se ELIMINATO correttamente
    //modifySkuitem(404, modifySkuitem2); //skuitem2 non esiste piu
    //modifySkuitem(422, modifySkuitemWrong); //FORMATO SBAGLIATO ==> ERRORE 
    //modifySkuitem(422, modifySkuitemWrong2); //FORMATO SBAGLIATO ==> ERRORE 

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

    function storeSku(expectedHTTPStatus, data) {
        it('store sku', function (done) {
            agent.post('/api/sku')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }

    function getSku(expectedHTTPStatus, data, id) {
        it('get sku', function (done) {
            agent.get('/api/skus/' + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    r.body.description.should.equal(data.description);
                    r.body.weight.should.equal(data.weight);
                    r.body.volume.should.equal(data.volume);
                    r.body.availableQuantity.should.equal(data.availableQuantity);
                    if(r.body.testDescriptors.length != 0){
                        r.body.testDescriptors.should.equal(data.testDescriptors);
                    }
                    done();
                });
        });
    }

    function getMultipleSkus(expectedHTTPStatus, data) {
        it('get multiple skus', function (done) {
            agent.get('/api/skus')
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    for (let i = 0; i < r.body.length; ++i) {
                        r.body[i].id = i+1;
                        r.body[i].description.should.equal(data[i].description);
                        r.body[i].weight.should.equal(data[i].weight);
                        r.body[i].volume.should.equal(data[i].volume);
                        r.body[i].availableQuantity.should.equal(data[i].availableQuantity);
                        if(r.body[i].testDescriptors.length != 0){
                            r.body[i].testDescriptors.should.equal(data[i].testDescriptors);
                        }
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
                        if(r.body[i].DateOfStock != null || data[i].DateOfStock != null){
                            r.body[i].DateOfStock.should.equal(data[i].DateOfStock);
                        }
                    }
                    done();
                });
        });
    }

    function getNonExistingSku(expectedHTTPStatus, id) {
        it('get non existing sku', function (done) {
            agent.get('/api/skus/' + id)
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
                            if(r.body.DateOfStock != null || data.newDateOfStock != null){
                                r.body.DateOfStock.should.equal(data.newDateOfStock);
                            }
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

    function deleteSku(expectedHTTPStatus, id) {
        it('delete sku', function (done) {
            agent.delete('/api/skus/' + id)
                .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                });
        });
    }
});