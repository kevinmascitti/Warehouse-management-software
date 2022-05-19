const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const position = require('../warehouse/position');

const position1 = {
    positionID: "000033335555",
    aisleID: "0000",
    row: "3333",
    col: "5555",
    maxWeight: 500,
    maxVolume: 600,
    occupiedWeight: 200,
    occupiedVolume: 300
}

const position2 = {
    positionID: "000033336666",
    aisleID: "0000",
    row: "3333",
    col: "6666",
    maxWeight: 400,
    maxVolume: 300,
    occupiedWeight: 100,
    occupiedVolume: 100
}

const wrongPosID = {
    positionID: 000033337777,
    aisleID: "0000",
    row: "3333",
    col: "7777",
    maxWeight: 400,
    maxVolume: 300,
    occupiedWeight: 100,
    occupiedVolume: 100
}

const wrongPosFields = {
    positionID: "000033337777",
    aisleID: 0000,
    row: 3333,
    col: 7777,
    maxWeight: "400",
    maxVolume: 300,
    occupiedWeight: 100,
    occupiedVolume: 100
}

const modifyPosition = {
    positionID: "000033335555",
    newAisleID: "0000",
    newRow: "3333",
    newCol: "4444",
    newMaxWeight: 1200,
    newMaxVolume: 600,
    newOccupiedWeight: 200,
    newOccupiedVolume: 100
}

const modifyWrongPosition = {
    positionID: "Stringa con length > 12",
    newAisleID: "Stringa",
    newRow: " con length ",
    newCol: "> 12",
    newMaxWeight: 120,
    newMaxVolume: 50,
    newOccupiedWeight: 0,
    newOccupiedVolume: 0
}

const modifyWrongPosition2 = {
    positionID: 000033334444,
    newAisleID: "0000",
    newRow: "3333",
    newCol: "1111",
    newMaxWeight: 120,
    newMaxVolume: 50,
    newOccupiedWeight: 0,
    newOccupiedVolume: 0
}

const modifyWrongPosition3 = {
    positionID: "111111111111",
    newAisleID: "2222",
    newRow: "2222",
    newCol: "2222",
    newMaxWeight: 1200,
    newMaxVolume: 600,
    newOccupiedWeight: 200,
    newOccupiedVolume: 100
}

const modifyWrongPosition4 = {
    positionID: "000033334444",
    newAisleID: "0000",
    newRow: "3333",
    newCol: "6666",
    newMaxWeight: 1200,
    newMaxVolume: 600,
    newOccupiedWeight: 200,
    newOccupiedVolume: 100
}

const modifyPositionID = {
    positionID: "000033334444",
    newPositionID: "000033333333"
}

const modifyWrongPositionID = {
    positionID: "111111111111",
    newPositionID: "222222222222"
}

const modifyWrongPositionID2 = {
    positionID: 000033333333,
    newPositionID: "222222222222"
}

const modifyWrongPositionID3 = {
    positionID: "000033333333",
    newPositionID: "000033336666"
}

describe('test position apis', () => {
    
    before(async () => {
        await position.deleteAllPositions();
    });
    
    storePosition(201, position1); //position1 inserito

    storePosition(201, position2); //position2 inserito
    storePosition(503, position2); //DUPLICATO ==> ERRORE

    storePosition(422, wrongPosID); //FORMATO SBAGLIATO ==> ERRORE
    storePosition(422, wrongPosFields); //FORMATO SBAGLIATO ==> ERRORE

    getMultiplePositions(200, [position1, position2]); //position1 e position2 ritornati
    
    modifyPos(200, modifyPosition); //modifico position1 e controllo modifiche
    modifyPos(422, modifyWrongPosition); //FORMATO SBAGLIATO ==> ERRORE
    modifyPos(422, modifyWrongPosition2); //FORMATO SBAGLIATO ==> ERRORE
    modifyPos(404, modifyWrongPosition3); //POSITIONID INESISTENTE NEL DB ==> ERRORE
    modifyPos(404, modifyWrongPosition4); //NEWPOSITIONID GIA PRESENTE NEL DB ==> ERRORE

    modifyPosID(200, modifyPositionID);
    modifyPosID(404, modifyWrongPositionID); //POSITIONID INESISTENTE NEL DB ==> ERRORE
    modifyPosID(422, modifyWrongPositionID2); //FORMATO SBAGLIATO ==> ERRORE
    modifyPosID(404, modifyWrongPositionID3); //NEWPOSITIONID GIA PRESENTE NEL DB ==> ERRORE

    deletePosition(204, position1); //elimino position1
    deletePosition(422, wrongPosID); //FORMATO SBAGLIATO ==> ERRORE
    deletePosition(422, wrongPosFields); //FORMATO SBAGLIATO ==> ERRORE
});

function getMultiplePositions(expectedHTTPStatus, data) {
    it('get multiple positions', function (done) {
        agent.get('/api/positions')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body[i].positionID.should.equal(data[i].positionID);
                    r.body[i].aisleID.should.equal(data[i].aisleID);
                    r.body[i].row.should.equal(data[i].row);
                    r.body[i].col.should.equal(data[i].col);
                    r.body[i].maxWeight.should.equal(data[i].maxWeight);
                    r.body[i].maxVolume.should.equal(data[i].maxVolume);
                    r.body[i].occupiedWeight.should.equal(data[i].occupiedWeight);
                    r.body[i].occupiedVolume.should.equal(data[i].occupiedVolume);
                }
                done();
            });
    });
}

function storePosition(expectedHTTPStatus, data) {
    it('store position', function (done) {
        agent.post('/api/position')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyPos(expectedHTTPStatus, data) {
    it('modify position', function (done) {
        agent.put('/api/position/' + data.positionID)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyPos(expectedHTTPStatus, data) {
    it('modify position', function (done) {
        agent.put('/api/position/' + data.positionID + '/changeID')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deletePosition(expectedHTTPStatus, data) {
    it('delete position', function (done) {
        agent.delete('/api/position/' + data.positionID)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}