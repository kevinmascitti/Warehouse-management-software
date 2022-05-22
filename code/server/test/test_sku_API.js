const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const sku = require('../warehouse/sku');
const positionF = require('../warehouse/position');

const sku1 = {
    "description": "first new sku",
    "weight": 100, //occupera esattamente tutta la posizione 5!!! (OK!)
    "volume": 80,
    "notes": "first SKU",
    "price": 10.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

const sku2 = {
    "description": "second new sku",
    "weight": 100,
    "volume": 50,
    "notes": "second SKU",
    "price": 10.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

const sku3 = {
    "description": "third new sku",
    "weight": 60,
    "volume": 60,
    "notes": "tihrd SKU",
    "price": 10.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

const sku4 = {
    "description": "fourth new sku",
    "weight": 70,
    "volume": 60,
    "notes": "fourth SKU",
    "price": 40.99,
    "availableQuantity": 40,
    position: null,
    "testDescriptors": []
}

const sku5_is_HUGE = { //TOO BIG TO BE STORED
    "description": "fourth new sku",
    "weight": 101,
    "volume": 376,
    "notes": "fourth SKU",
    "price": 40.99,
    "availableQuantity": 40,
    position: null,
    "testDescriptors": []
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

const modifySku1_without_tds = {
    "newDescription": "MODIFIED BY MEEE",
    "newWeight": 99,
    "newVolume": 50, //errore: posiotion5 ha volume max 80
    "newNotes": "first MODIFIED SKU, WITHOUT TESTDESCRIPTORS",
    "newPrice": 90.99,
    "newAvailableQuantity": 90
};

const modifySku1_without_tds_HUGE = {
    "newDescription": "MODIFIED BY MEEE",
    "newWeight": 99,
    "newVolume": 811, //errore: posiotion5 ha volume max 80
    "newNotes": "first MODIFIED SKU, WITHOUT TESTDESCRIPTORS",
    "newPrice": 90.99,
    "newAvailableQuantity": 90
};

const modifySku2_with_tds = {
    "newDescription": "MODIFIED BY MEEE",
    "newWeight": 9,
    "newVolume": 65,
    "newNotes": "first MODIFIED SKU, WITH TESTDESCRIPTORS",
    "newPrice": 98.98,
    "newAvailableQuantity": 98,
    "newTestDescriptors": [98, 99, 100]
};

const modifySku2_with_tds_HUGE = {
    "newDescription": "MODIFIED BY MEEE",
    "newWeight": 101, //too big
    "newVolume": 65,
    "newNotes": "first MODIFIED SKU, WITH TESTDESCRIPTORS",
    "newPrice": 98.98,
    "newAvailableQuantity": 98,
    "newTestDescriptors": [98, 99, 100]
};

const modifySku3Position = {
    "position": "333333333333"
}

const modifySku4Position = {
    "position": "444444444444"
}

const modifySku5Position = {
    "position": "555555555555"
}

const notExistingPosition = {
    "position": "999999999999"
}

const modifySkuWrong1 = {
    "newDescription": "a new sku",
    "newWeight": -1, //error 422
    "newVolume": 50,
    "newNotes": "first SKU",
    "newPrice": 10.99,
    "newAvailableQuantity": 50
};

const modifySkuWrong2 = {
    "newDescription": "a new sku",
    "newWeight": 100,
    "newVolume": 50,
    "newNotes": "first SKU",
    "newPrice": -10.99, //error
    "newAvailableQuantity": 50
};

describe('test sku apis', () => {

    let position3 = {
        "positionID": "333333333333",
        "aisleID": "3333",
        "row": "3333",
        "col": "3333",
        "maxWeight": 100,
        "maxVolume": 100,
        "occupiedWeight": 30,
        "occupiedVolume": 30
    }

    let position4 = {
        "positionID": "444444444444",
        "aisleID": "4444",
        "row": "4444",
        "col": "4444",
        "maxWeight": 100,
        "maxVolume": 100,
        "occupiedWeight": 5,
        "occupiedVolume": 5
    }

    let position5 = {
        "positionID": "555555555555",
        "aisleID": "5555",
        "row": "5555",
        "col": "5555",
        "maxWeight": 100,
        "maxVolume": 80,
        "occupiedWeight": 0,
        "occupiedVolume": 0
    }

    let position6 = {
        "positionID": "666666666666",
        "aisleID": "6666",
        "row": "6666",
        "col": "6666",
        "maxWeight": 100,
        "maxVolume": 100,
        "occupiedWeight": 0,
        "occupiedVolume": 0
    }


    before(async () => {
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await positionF.deleteAllPositions();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
        await positionF.storePosition(position3);
        await positionF.storePosition(position4);
        await positionF.storePosition(position5);
        await positionF.storePosition(position6);
    });

    after(async () => {
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await positionF.deleteAllPositions();
    });

    getNonExistingSku(404, 3); //sku3 NON esiste ancora nel DB
    getNonExistingSku(200, 1); //sku1 ESISTE ancora nel DB
    getNonExistingSku(200, 2); //sku2 ESISTE ancora nel DB
    storeSku(201, sku3); //inserito correttamente
    getNonExistingSku(200, 3); //sku3 ORA esiste ancora nel DB
    getSku(200, sku3, 3); //controllo se ritornato correttamente
    getSku(200, sku2, 2); //controllo se ritornato correttamente
    getSku(200, sku1, 1); //controllo se ritornato correttamente
    getNonExistingSku(422, sku1, sku1.notes); //FORMATO ID ERRATO: NON NUMERICO!!
    storeSku(422, wrongSku1); //FORMATO weight SBAGLIATO ==> ERRORE 
    storeSku(422, wrongSku2); //FORMATO price SBAGLIATO ==> ERRORE 
    getMultipleSkus(200, [sku1, sku2, sku3]); //sku1 e skuitem3 e sku3 ritornati
    storeSku(201, sku4); //inserito correttamente
    storeSku(201, sku5_is_HUGE); //inserito correttamente
    getMultipleSkus(200, [sku1, sku2, sku3, sku4, sku5_is_HUGE]); //5 sku ritornati

    addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(200, sku3, 3, modifySku3Position, position3, null);
    addOrModifySkuPositionButSomeProblem(422, 4, modifySku3Position); //ERRORE, posizione gia assegnata a un diverso sku!!!!
    addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(200, sku4, 4, modifySku4Position, position4, null);
    addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(200, sku4, 4, modifySku4Position, position4, position4); //riassegno a stessa posizione => OK
    addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(200, sku4, 4, modifySku5Position, position5, position4); //cambio posizione ad uno sku con posizione gia assegnata e controllo TUTTI i cambiamenti
    addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(200, sku4, 4, modifySku4Position, position4, position5); //RICAMBIO posizione ad uno sku con posizione gia assegnata e controllo TUTTI i cambiamenti
    addOrModifySkuPositionButSomeProblem(422, 5, modifySku5Position); //ERRORE, sku is just SO HUGE OMG
    addOrModifySkuPositionButSomeProblem(404, 8, modifySku5Position); //ERRORE, sku with id 8 NOT EXISTS
    addOrModifySkuPositionButSomeProblem(404, 4, notExistingPosition); //ERRORE, position entered NOT EXISTS

    addOrModifySkuPositionButSomeProblem(422, 1, modifySku4Position); //sku1 in posizione 4 (OCCUPATA) ==> 422
    addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(200, sku1, 1, modifySku5Position, position5, null); //sku1 in posizione 5 (precedentemente occupata ma poi LIBERATA) ==> 200
    modifySkuAndCheck(200, modifySku1_without_tds, 1); //modifico sku1 senza aggiungere test descriptors e controllo modifiche
    modifySkuAndCheck(200, modifySku2_with_tds, 1); //modifico sku1 aggiungendo test descriptors e controllo modifiche

    modifySku(422, 1, modifySkuWrong1); //422 formato errato
    modifySku(422, 1, modifySkuWrong2); //422 formato errato

    modifySku(422, 1, modifySku2_with_tds_HUGE); //422 new values too big!!
    modifySku(422, 1, modifySku1_without_tds_HUGE); //422 new values too big!!

    //modifySkuitemAndCheck(200, modifySkuitem2); //modifico skuitem2 e controllo modifiche
    deleteSku(422, sku2.notes); //FORMATO ID ERRATO: NON NUMERICO!!
    getSku(200, sku2, 2); //controllo se ritornato correttamente
    deleteSku(204, 2); //elimino sku2
    getNonExistingSku(404, 2); //controllo se ELIMINATO correttamente
    deleteSku(204, 1); //elimino sku1
    modifySku(404, 1, modifySku1_without_tds); //sku1 non esiste piu
    //modifySkuitem(422, modifySkuitemWrong); //FORMATO SBAGLIATO ==> ERRORE 
    //modifySkuitem(422, modifySkuitemWrong2); //FORMATO SBAGLIATO ==> ERRORE 

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
                    r.body.notes.should.equal(data.notes);
                    r.body.price.should.equal(data.price);
                    if (r.body.position != null) {
                        r.body.position.should.equal(data.position);
                    }
                    if (r.body.testDescriptors.length != 0) {
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
                        r.body[i].id = i + 1;
                        r.body[i].description.should.equal(data[i].description);
                        r.body[i].weight.should.equal(data[i].weight);
                        r.body[i].volume.should.equal(data[i].volume);
                        r.body[i].availableQuantity.should.equal(data[i].availableQuantity);
                        r.body[i].notes.should.equal(data[i].notes);
                        r.body[i].price.should.equal(data[i].price);
                        if (r.body[i].position) {
                            r.body[i].position.should.equal(data[i].position);
                        }
                        if (r.body[i].testDescriptors.length != 0) {
                            r.body[i].testDescriptors.should.equal(data[i].testDescriptors);
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

    function modifySkuAndCheck(expectedHTTPStatus, data, id) {
        it('modify sku and check if all capacities changed correctly', function (done) {
            agent.put('/api/sku/' + id)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    agent.get('/api/skus/' + id)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            r.body.description.should.equal(data.newDescription);
                            r.body.weight.should.equal(data.newWeight);
                            r.body.volume.should.equal(data.newVolume);
                            r.body.availableQuantity.should.equal(data.newAvailableQuantity);
                            r.body.notes.should.equal(data.newNotes);
                            r.body.price.should.equal(data.newPrice);
                            if (r.body.testDescriptors.length != 0) {
                                for (let j = 0; j < r.body.testDescriptors.length; ++j) {
                                    r.body.testDescriptors[j].should.equal(data.newTestDescriptors[j]);
                                }
                            }
                            sku.getStoredSku({ id: id }).then(function (skk) {
                                sku.getPositionInfos(skk.position).then(function (posi) {
                                    posi.occupiedWeight.should.equal(data.newWeight);
                                    posi.occupiedVolume.should.equal(data.newVolume);
                                    done();
                                });
                            });
                        });
                });
            });
        }

    function modifySku(expectedHTTPStatus, id, data) {
                it('modify sku', function (done) {
                    agent.put('/api/sku/' + id)
                        .send(data)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
            }

    function addOrModifySkuPositionAndCheckNewAndOldPositionCapacities(expectedHTTPStatus, sku, id, newPos, posObj, oldPosObj) {
                it('add or modify sku position and check new and old positions capacities', function (done) {
                    agent.put('/api/sku/' + id + '/position')
                        .send(newPos)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            agent.get('/api/skus/' + id)
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    r.body.description.should.equal(sku.description);
                                    r.body.weight.should.equal(sku.weight);
                                    r.body.volume.should.equal(sku.volume);
                                    r.body.availableQuantity.should.equal(sku.availableQuantity);
                                    r.body.notes.should.equal(sku.notes);
                                    r.body.price.should.equal(sku.price);
                                    if (r.body.position != null) {
                                        r.body.position.should.equal(newPos.position);
                                    }
                                    if (r.body.testDescriptors.length != 0) {
                                        r.body.testDescriptors.should.equal(data.newTestDescriptors);
                                    }
                                    //controllo se capacita modificate correttamente
                                    positionF.getPosition({ positionID: newPos.position }).then(function (p) {
                                        p.occupiedWeight.should.equal(posObj.occupiedWeight + sku.weight);
                                        p.occupiedVolume.should.equal(posObj.occupiedVolume + sku.volume);
                                        if (oldPosObj != null && oldPosObj.positionID != posObj.positionID) {
                                            positionF.getPosition({ positionID: oldPosObj.positionID }).then(function (pOld) {
                                                pOld.occupiedWeight.should.equal(oldPosObj.occupiedWeight);
                                                pOld.occupiedVolume.should.equal(oldPosObj.occupiedVolume);
                                                done();
                                            });
                                        }
                                        else {
                                            done();
                                        }
                                    });
                                });
                        });
                });
            }

    function addOrModifySkuPositionButSomeProblem(expectedHTTPStatus, id, pos) {
                it('add or modify sku position but problem: not exist OR not capable OR already assigned', function (done) {
                    agent.put('/api/sku/' + id + '/position')
                        .send(pos)
                        .then(function (res) {
                            //422!!!!!!!!
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