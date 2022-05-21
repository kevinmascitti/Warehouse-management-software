const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const testR = require('../warehouse/testResult');

const testR1 = {
    id:1,
    idTestDescriptor:1,
    Date:"2021/11/29",
    Result: false,
    rfid: "55555678901234567890123456789015"
};

const testR2 = {
    id:2,
    idTestDescriptor:3,
    Date:"2021/10/12",
    Result: true,
    rfid: "55555678901234567890123456789015"
};

const wrongTestDescriptor = {
    id:2,
    idTestDescriptor:"ciao",
    Date:"2021/10/12",
    Result: true,
    rfid: "55555678901234567890123456789015"
};

const modifytestR1 = {
    id:1,
    idTestDescriptor:2,
    Date:"2021/02/10",
    Result: false,
    rfid: "55555678901234567890123456789015"
};

const modifytestR2 = {
    id:2,
    idTestDescriptor:2,
    Date:"2021/10/12",
    Result: false,
    rfid: "55555678901234567890123456789015"
};

const modifytestRWrongId = {
    id:"string",
    idTestDescriptor:3,
    Date:"2021/10/12",
    Result: true,
    rfid: "55555678901234567890123456789015"
};

const modifyWrongTestDescriptor = {
    id:1,
    idTestDescriptor:"string",
    Date:"2021/10/12",
    Result: true,
    rfid: "55555678901234567890123456789015"
}

const modifyWrongResult = {
    id:1,
    idTestDescriptor:1,
    Date:"2021/10/12",
    Result: 3,
    rfid: "55555678901234567890123456789015"
}

describe('test testResult api', () => {

    before(async () => {

        rfid = await testR.getStoredTestResult({rfid: "55555678901234567890123456789015", id: 1});
        await testR.deleteAlltestResults();
    });

    getNonExistingtestR(404, testR1, rfid); //testR1 non esiste ancora nel DB
    storetestR(201, testR1); //testR1 inserito
    gettestR(200, testR1, rfid); //ritornato correttamente
    storetestR(201, testR2); //testR2 inserito
    storetestR(500, testR2); //DUPLICATO ==> ERRORE 
    storetestR(422, wrongTestDescriptor); //FORMATO SBAGLIATO ==> ERRORE
    getMultipletestR(200, [testR1, testR2], rfid); //testR1 e testR2 ritornati
    modifytestRAndCheck(200, modifytestR1, rfid); //modifico testR1 e controllo modifiche
    deletetestR(204, testR2); //elimino testR1
    getNonExistingtestR(404, testR2, rfid); //controllo che sia stato eliminato
    modifytestR(404, modifytestR2); //testR2 non esiste piu
    modifytestR(422, modifyWrongSku); //FORMATO SBAGLIATO ==> ERRORE 
    modifytestR(422, modifyWrongTestDescriptor); //formato testDescriptor string invece di integer
    modifytestR(422, modifyWrongResult); //formato Result integer invece di boolean

});

function storetestR(expectedHTTPStatus, data) {
    it('store testResult', function (done) {
        agent.post('/api/skuitems/testResult')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function gettestR(expectedHTTPStatus, data, rfid) {
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

function getMultipletestR(expectedHTTPStatus, data, rfid) {
    it('get multiple testResults', function (done) {
        agent.get('/api/skuitems/' + rfid + '/testResults')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body.id[i].should.equal(data[i].id);
                    r.body.idTestDescriptor[i].should.equal(data[i].idTestDescriptor);
                    r.body.Date[i].should.equal(data[i].Date);
                    r.body.Result[i].should.equal(data[i].Result);
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

function modifytestRAndCheck(expectedHTTPStatus, data, rfid) {
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

function modifytestR(expectedHTTPStatus, data) {
    it('modify testResult', function (done) {
        agent.put('/api/skuitems/' + rfid + '/testResult/' + data.id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deletetestR(expectedHTTPStatus, data) {
    it('delete testResult', function (done) {
        agent.delete('/api/skuitems/' + rfid + '/testResult/' + data.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}