const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const testD = require('../warehouse/testDescriptor');
const sku = require('../warehouse/sku');

const sku1 = {
    description: "Sku1",
    weight: 100,
    volume: 50,
    notes: "note",
    price: 10.99,
    availableQuantity: 50
}

const sku2 = {
    description: "Sku2",
    weight: 4,
    volume: 1,
    notes: "note",
    price: 87.56,
    availableQuantity: 5
}

const testD1 = {
    id: 1,
    name: "Meow1",
    procedureDescription: "Second test",
    idSKU: 1
};

const testD2 = {
    id: 2,
    name: "Meow2",
    procedureDescription: "Second test",
    idSKU: 2
};

const testWrongSku = {
    id: 3,
    name: "Meow",
    procedureDescription: "Test",
    idSKU: 99
}

const testTextSku = {
    id: 4,
    name: "Meow",
    procedureDescription: "Test",
    idSKU: "sku"
}

const modTestD1 = {
    id: 1,
    newName: "MeowMeow",
    newProcedureDescription: "First mod test",
    newIdSKU: 2
}

const modTestD2 = {
    id: 2,
    newName: "MeowMeow2",
    newProcedureDescription: "Second mod test",
    newIdSKU: 2
}

const modTestDWrongID = {
    id: 99,
    newName: "MeowMeow",
    newProcedureDescription: "Test",
    newIdSKU: 2
}

const modTestDWrongSku = {
    id: 1,
    newName: "MeowMeow",
    newProcedureDescription: "Test",
    newIdSKU: 99
}

const modTestDTextId = {
    id: "id",
    newName: "MeowMeow",
    newProcedureDescription: "Test",
    newIdSKU: 1
}

const modTestDNegativeId = {
    id: -1,
    newName: "MeowMeow",
    newProcedureDescription: "Test",
    newIdSKU: 1
}

const modTestDTextSku = {
    id: 1,
    newName: "MeowMeow",
    newProcedureDescription: "Test",
    newIdSKU: "text"
}

const modTestDNegativeSku = {
    id: 1,
    newName: "MeowMeow",
    newProcedureDescription: "Test",
    newIdSKU: -99
}

describe("Testing testDescriptor API", () => {

    before(async () => {
        await testD.deleteAllTestDescriptors();
        await testD.resetTestDescriptorAutoIncrement();
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
    });

    //POST
    storeTestD(201, testD1);
    storeTestD(201, testD2);
    storeTestD(404, testWrongSku); //test post with non existing idSKU
    storeTestD(422, testTextSku); //test post with string idSKU
    //GET
    getAllTestD(200, [testD1, testD2]); //test get all testDescriptors
    getTestD(200, testD1);
    getNonExistingTestD(404, {id:99}); //test get with non existing id
    getNonExistingTestD(422, {id:"string"}); //test get with string id
    getNonExistingTestD(422, {id:-5}); //test get with negative id
    //PUT
    modifyTestD(200, modTestD1);
    modifyTestDAndCheck(200, modTestD2); //test put and check values with get
    modifyTestD(404, modTestDWrongID); //test put with non existing id
    modifyTestD(404, modTestDWrongSku); //test put with non existing idSKU
    modifyTestD(422, modTestDTextId); //test put with string id
    modifyTestD(422, modTestDNegativeId); //test put with negative id
    modifyTestD(422, modTestDTextSku); //test put with string idSKU
    modifyTestD(422, modTestDNegativeSku); //test put with negative idSKU
    //DELETE
    deleteTestD(204, testD1);
    deleteTestD(422, {id:-1}); //test delete with negative id
    deleteTestD(422, {id:"text"}); //test delete with text id

    after(async () => {
        await testD.deleteAllTestDescriptors();
        await testD.resetTestDescriptorAutoIncrement();
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
    });

});

function storeTestD(expectedHTTPStatus, data) {
    it('store testDescriptor', function (done) {
        agent.post('/api/testDescriptor')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getTestD(expectedHTTPStatus, data) {
    it('get testDescriptor', function (done) {
        agent.get('/api/testDescriptors/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.equal(data.id);
                r.body.name.should.equal(data.name);
                r.body.procedureDescription.should.equal(data.procedureDescription);
                r.body.idSKU.should.equal(data.idSKU);
                done();
            });
    });
}

function getAllTestD(expectedHTTPStatus, data) {
    it('get multiple testDescriptors', function (done) {
        agent.get('/api/testDescriptors')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body[i].id.should.equal(data[i].id);
                    r.body[i].name.should.equal(data[i].name);
                    r.body[i].procedureDescription.should.equal(data[i].procedureDescription);
                    r.body[i].idSKU.should.equal(data[i].idSKU);
                }
                done();
            });
    });
}

function getNonExistingTestD(expectedHTTPStatus, data) {
    it('get non existing testDescriptor', function (done) {
        agent.get('/api/testDescriptors/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyTestDAndCheck(expectedHTTPStatus, data) {
    it('modify testDescriptor and check', function (done) {
        agent.put('/api/testDescriptor/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('/api/testDescriptors/' + data.id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(data.id);
                        r.body.name.should.equal(data.newName);
                        r.body.procedureDescription.should.equal(data.newProcedureDescription);
                        r.body.idSKU.should.equal(data.newIdSKU);
                        done();
                    });
            });
    });
}

function modifyTestD(expectedHTTPStatus, data) {
    it('modify testDescriptor', function (done) {
        agent.put('/api/testDescriptor/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteTestD(expectedHTTPStatus, data) {
    it('delete testDescriptor', function (done) {
        agent.delete('/api/testDescriptor/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}