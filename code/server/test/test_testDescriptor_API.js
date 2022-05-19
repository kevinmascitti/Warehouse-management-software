const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const testD = require('../warehouse/testDescriptor');

const testD1 = {
    id: 1,
    name: "Meow1",
    procedureDescription: "First test",
    idSKU: 1
};

const testD2 = {
    id: 2,
    name: "Meow2",
    procedureDescription: "Second test",
    idSKU: 1
};

const wrongSku = {
    id: 1,
    name: "Meow1",
    procedureDescription: "First test",
    idSKU: "number"
};

const modifyTestD1 = {
    id: 1,
    newName: "Modified 1",
    newProcedureDescription: "First test mod",
    newIdSKU: 2
};

const modifyTestD2 = {
    id: 2,
    newName: "Modified 2",
    newProcedureDescription: "Second test mod",
    newIdSKU: 3
};

const modifytestDWrongId = {
    id: 'string',
    newName: "Modified wrong id",
    newProcedureDescription: "Test API",
    newIdSKU: 2
};

const modifyWrongSku = {
    id: 1,
    newName: "Modified wrong sku",
    newProcedureDescription: "Test API",
    newIdSKU: 1999
}

describe('test testDescriptor api', () => {

    before(async () => {
        await testD.deleteAllTestDescriptors();
    });

    getNonExistingTestD(404, testD1); //TestD1 non esiste ancora nel DB
    storeTestD(201, testD1); //TestD1 inserito
    getTestD(200, testD1); //ritornato correttamente
    storeTestD(201, testD2); //TestD2 inserito
    storeTestD(500, testD2); //DUPLICATO ==> ERRORE 
    storeTestD(422, wrongSku); //FORMATO SBAGLIATO ==> ERRORE
    getMultipleTestD(200, [testD1, testD2]); //TestD1 e TestD2 ritornati
    modifyTestDAndCheck(200, modifyTestD1); //modifico TestD1 e controllo modifiche
    deleteTestD(204, testD2); //elimino TestD1
    getNonExistingTestD(404, testD2); //controllo che sia stato eliminato
    modifyTestD(404, modifyTestD2); //TestD2 non esiste piu
    modifyTestD(422, modifyWrongSku); //FORMATO SBAGLIATO ==> ERRORE 
    modifyTestD(422, modifytestDWrongId);
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

function getMultipleTestD(expectedHTTPStatus, data) {
    it('get multiple testDescriptors', function (done) {
        agent.get('/api/testDescriptors')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body.id[i].should.equal(data[i].id);
                    r.body.name[i].should.equal(data[i].name);
                    r.body.procedureDescription[i].should.equal(data[i].procedureDescription);
                    r.body.idSKU[i].should.equal(data[i].idSKU);
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
    it('modify testDescriptor', function (done) {
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