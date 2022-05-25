const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const testR = require('../warehouse/testResult');
const testD = require('../warehouse/testDescriptor');
const skuI = require('../warehouse/skuitem');
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

const skuI1 = {
    rfid: "12345678901234567890123456789014",
    skuid: 1,
    Available: 0,
    dateofstock: "2021/11/29 12:30"
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

const testR1 = {
    id: 1,
    idTestDescriptor: 1,
    Date: "2021/11/29",
    Result: "0",
    rfid: "12345678901234567890123456789014"
};

const testR2 = {
    id: 2,
    idTestDescriptor: 2,
    Date: "2021/10/12",
    Result: "1",
    rfid: "12345678901234567890123456789014"
};

const testR90 = {
    id: 90,
    idTestDescriptor: 1,
    Date: "2021/10/12",
    Result: "1",
    rfid: "12345678901234567890123456789014"
}

const testRneg = {
    id: -5,
    idTestDescriptor: 1,
    Date: "2021/10/12",
    Result: "1",
    rfid: "12345678901234567890123456789014"
}

const modTestR1 = {
    id: 1,
    newIdTestDescriptor: 1,
    newDate: "2022/02/16",
    newResult: "1",
    rfid: "12345678901234567890123456789014"
};

const modTestR2 = {
    id: 2,
    newIdTestDescriptor: 2,
    newDate: "2022/02/17",
    newResult: "0",
    rfid: "12345678901234567890123456789014"
};

describe('Testing testResult API', () => {

    before(async () => {
        await testR.deleteAllTestResults();
        await testR.resetTestResultAutoIncrement();
        await testD.deleteAllTestDescriptors();
        await testD.resetTestDescriptorAutoIncrement();
        await skuI.deleteAllSkuitems();
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
        await skuI.storeSkuitem(skuI1);
        await testD.storeTestDescriptor(testD1);
        await testD.storeTestDescriptor(testD2);
    });

    //POST
    storeTestR(201, testR1);
    storeTestR(201, testR2);
    storeTestR(404, {idTestDescriptor:99, rfid:"12345678901234567890123456789014", Date: "2022/01/10"}); //test post with non existing testDescriptor
    storeTestR(404, {idTestDescriptor:1, rfid:"12345678901234567890123456789011", Date: "2022/01/10"}); //test post with non existing rfid
    storeTestR(422, {idTestDescriptor:"text", rfid:"12345678901234567890123456789014", Date: "2022/01/10"}); //test post with string idTestDescriptor
    storeTestR(422, {idTestDescriptor:1, rfid:"123456789012345678901234567890", Date: "2022/01/10"}); //test post with rfid too short
    //GET
    getMultipleTestR(200, [testR1, testR2], "12345678901234567890123456789014");
    getMultipleTestR(404, [testR1, testR2], "12345678901234567890123456789011"); //test get with non existing rfid
    getMultipleTestR(422, [testR1, testR2], "123456789012345678901234567890"); //test get with short rfid
    getMultipleTestR(422, [testR1, testR2], "-123456789012345678901234567890"); //test get with negative rfid
    getTestR(200, testR1, "12345678901234567890123456789014");
    getNonExistingtestR(404, testR90, "12345678901234567890123456789014"); //test get with non existing testResult
    getNonExistingtestR(404, testR1, "12345678901234567890123456789011"); //test get with non existing rfid
    getNonExistingtestR(422, testRneg, "12345678901234567890123456789014"); //test get with negative testR id
    //PUT
    modifyTestR(200, modTestR1, "12345678901234567890123456789014");
    modifyTestRAndCheck(200, modTestR2, "12345678901234567890123456789014"); //test put and check if testResult was updated
    modifyTestR(422, {id:1,newIdTestDescriptor:1,newDate:"2022/02/10"}, "123456789012345678901234567890"); //test put with short rfid
    modifyTestR(422, {id:1,newIdTestDescriptor:"text",newDate:"2022/02/10"}, "12345678901234567890123456789014"); //test put with string testDescriptor id
    modifyTestR(422, {id:"meow",newIdTestDescriptor:1,newDate:"2022/02/10"}, "12345678901234567890123456789014"); //test put with string id
    modifyTestR(404, {id:99, newIdTestDescriptor:1,newDate:"2022/02/10"}, "12345678901234567890123456789014"); //test put with non existing testResult
    modifyTestR(404, {id:1, newIdTestDescriptor:99,newDate:"2022/02/10"}, "12345678901234567890123456789014"); //test put with non existing testDescriptor
    modifyTestR(404, {id:1, newIdTestDescriptor:1,newDate:"2022/02/10"}, "12345678901234567890123456789015"); //test put with non existing skuitem
    //DELETE
    deleteTestR(204, testR1, "12345678901234567890123456789014");
    getNonExistingtestR(404, testR1, "12345678901234567890123456789014"); //test if item was deleted
    deleteTestR(422, {id:"string"}, "12345678901234567890123456789014"); //test delete with string id
    deleteTestR(422, {id:2}, "123456789012345678901234567890"); //test delete with short rfid

    after(async () => {
        await testR.deleteAllTestResults();
        await testR.resetTestResultAutoIncrement();
        await testD.deleteAllTestDescriptors();
        await testD.resetTestDescriptorAutoIncrement();
        await skuI.deleteAllSkuitems();
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
    });

});

function storeTestR(expectedHTTPStatus, data) {
    it('store testResult', function (done) {
        agent.post('/api/skuitems/testResult')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getTestR(expectedHTTPStatus, data, rfid) {
    it('get testResult', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.equal(data.id);
                r.body.idTestDescriptor.should.equal(data.idTestDescriptor);
                r.body.Date.should.equal(data.Date);
                r.body.Result.should.equal(data.Result);
                done();
            });
    });
}

function getMultipleTestR(expectedHTTPStatus, data, rfid) {
    it('get multiple testResults', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body[i].id.should.equal(data[i].id);
                    r.body[i].idTestDescriptor.should.equal(data[i].idTestDescriptor);
                    r.body[i].Date.should.equal(data[i].Date);
                    r.body[i].Result.should.equal(data[i].Result);
                }
                done();
            });
    });
}

function getNonExistingtestR(expectedHTTPStatus, data, rfid) {
    it('get non existing testResult', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyTestRAndCheck(expectedHTTPStatus, data, rfid) {
    it('modify testResult', function (done) {
        agent.put('/api/skuitems/' + rfid + '/testResult/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('/api/skuitems/' + rfid + '/testResults/' + data.id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(data.id);
                        r.body.idTestDescriptor.should.equal(data.newIdTestDescriptor);
                        r.body.Date.should.equal(data.newDate);
                        r.body.Result.should.equal(data.newResult);
                        done();
                    });
            });
    });
}

function modifyTestR(expectedHTTPStatus, data, rfid) {
    it('modify testResult', function (done) {
        agent.put('/api/skuitems/' + rfid + '/testResult/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteTestR(expectedHTTPStatus, data, rfid) {
    it('delete testResult', function (done) {
        agent.delete('/api/skuitems/' + rfid + '/testResult/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}