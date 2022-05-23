const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const user = require('../warehouse/user');

const user1 = {
    username: "deliveryEmployee99@ezwh.com",
    name: "Simon",
    surname: "Lebon",
    password: "testpassword",
    type: "deliveryEmployee"
}

const user1log = {
    id: 6,
    username: "deliveryEmployee99@ezwh.com",
    name: "Simon",
    surname: "Lebon",
    password: "testpassword",
    type: "deliveryEmployee"
}

const user2 = {
    username: "customer99@ezwh.com",
    name: "Zack",
    surname: "Smart",
    password: "testpassword",
    type: "customer"
}

const user3 = {
    username: "supplier99@ezwh.com",
    name: "Freddie",
    surname: "Sa",
    password: "testpassword",
    type: "supplier"
}

const user4 = {
    username: "clerk99@ezwh.com",
    name: "Man",
    surname: "Ze",
    password: "testpassword",
    type: "clerk"
}

const user5 = {
    username: "qualityEmployee99@ezwh.com",
    name: "Fre",
    surname: "Me",
    password: "testpassword",
    type: "qualityEmployee"
}

const user6 = {
    username: "managerrr@ezwh.com",
    name: "Simon",
    surname: "Lebon",
    password: "testpassword",
    type: "manager"
}

const wrongUsername = {
    username: "deliveryEmployee98.ezwh@com",
    name: "Sam",
    surname: "Sant",
    password: "testpassword",
    type: "deliveryEmployee"
}

const wrongPassword = {
    username: "deliveryEmployee98@ezwh.com",
    name: "Sam",
    surname: "Sant",
    password: 10119921,
    type: "deliveryEmployee"
}

const wrongPassManagerL = {
    username: "manager1@ezwh.com",
    password: "testpassword111"
}

const deliveryEmployeeL = {
    username: "deliveryEmployee99@ezwh.com",
    password: "testpassword"
}

const customerL = {
    username: "customer99@ezwh.com",
    password: "testpassword"
}

const wrongUserCustomerL = {
    username: "customer99@ezwh..com",
    password: "testpassword"
}

const supplierL = {
    username: "supplier99@ezwh.com",
    password: "testpassword"
}

const wrongPassSupplierL = {
    username: "supplier99@ezwh.com",
    password: 1234349730
}

const clerkL = {
    username: "clerk99@ezwh.com",
    password: "testpassword"
}

const wrongUserClerkL = {
    username: "supplier99@ezwh.com",
    password: "testpassword"
}

const qualityEmployeeL = {
    username: "qualityEmployee99@ezwh.com",
    password: "testpassword"
}

const wrongUserQualityEmployeeL = {
    username: 4729220018,
    password: "testpassword"
}

const modifyUserType = {
    username: "clerk99@ezwh.com",
    oldType: "clerk",
    newType: "qualityEmployee"
}

const modifyUserWrongType = {
    username: "clerk99@ezwh.com",
    oldType: "deliveryEmployee",
    newType: "qualityEmployee"
}

const modifyUserFromManager = {
    username: "manager99@ezwh.com",
    oldType: "manager",
    newType: "qualityEmployee"
}

const modifyUserUnexistent = {
    username: "clerk@ezwh.com",
    oldType: "clerk",
    newType: "qualityEmployee"
}

const deleteUserType = {
    username: "clerk99@ezwh.com",
    type: "qualityEmployee"
}

const deleteManager = {
    username: "manager99@ezwh.com",
    type: "manager"
}


describe('test user apis', () => {
    
    before(async () => {
        await user.deleteAllUsers();
        await user.resetUserAutoincrement();
    });

    after(async () => {
        await user.deleteAllUsers();
        await user.resetUserAutoincrement();
    });
    
    storeUser(201, user1); //user inserito
    storeUser(201, user2); //user inserito
    storeUser(201, user3); //user inserito
    storeUser(201, user4); //user inserito
    storeUser(201, user5); //user inserito
    storeUser(409, user5); //USER DUPLICATO ==> ERRORE
    storeUser(422, user6); //USER MANAGER ==> ERRORE

    storeUser(422, wrongUsername); //FORMATO USERNAME SBAGLIATO ===> ERRORE
    storeUser(422, wrongPassword); //FORMATO USERNAME SBAGLIATO ===> ERRORE
    
    getSuppliers(200, [user3]);
    getUsers(200, [user1, user2, user3, user4, user5]);
    
    getInfo(404, user1);
    managerLogin(401, wrongPassManagerL);
    logout(200);
    deliveryEmployeeLogin(200, deliveryEmployeeL);
    getInfo(200, user1log);
    logout(200);
    customerLogin(401, wrongUserCustomerL);
    customerLogin(200, customerL);
    logout(200);
    supplierLogin(401, wrongPassSupplierL);
    supplierLogin(200, supplierL);
    logout(200);
    clerkLogin(401, wrongUserClerkL);
    clerkLogin(200, clerkL);
    logout(200);
    qualityEmployeeLogin(401, wrongUserQualityEmployeeL);
    qualityEmployeeLogin(200, qualityEmployeeL);
    logout(200);

    modifyUser(200, modifyUserType); //modifico type
    modifyUser(404, modifyUserWrongType); //FORMATO SBAGLIATO ==> ERRORE
    modifyUser(422, modifyUserFromManager); //FORMATO SBAGLIATO ==> ERRORE
    modifyUser(404, modifyUserUnexistent); //USER INESISTENTE ==> ERRORE

    deleteUser(204, deleteUserType);
    deleteUser(422, deleteManager);
});


function getInfo(expectedHTTPStatus, data) {
    it('get user info', function (done) {
        agent.get('/api/userinfo')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus===200){
                    r.body.id.should.equal(data.id);
                    r.body.username.should.equal(data.username);
                    r.body.name.should.equal(data.name);
                    r.body.surname.should.equal(data.surname);
                    r.body.type.should.equal(data.type);
                }
                done();
            });
    });
}

function getSuppliers(expectedHTTPStatus, data) {
    it('get all suppliers', function (done) {
        agent.get('/api/suppliers')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body[i].name.should.equal(data[i].name);
                    r.body[i].surname.should.equal(data[i].surname);
                    r.body[i].email.should.equal(data[i].username);
                }
                done();
            });
    });
}

function getUsers(expectedHTTPStatus, data) {
    it('get all users', function (done) {
        agent.get('/api/users')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                for (let i = 0; i < r.body.length; ++i) {
                    r.body[i].name.should.equal(data[i].name);
                    r.body[i].surname.should.equal(data[i].surname);
                    r.body[i].email.should.equal(data[i].username);
                    r.body[i].type.should.equal(data[i].type);
                }
                done();
            });
    });
}

function storeUser(expectedHTTPStatus, data) {
    it('store user', function (done) {
        agent.post('/api/newUser')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function managerLogin(expectedHTTPStatus, data) {
    it('login manager', function (done) {
        agent.post('/api/managerSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function customerLogin(expectedHTTPStatus, data) {
    it('login customer', function (done) {
        agent.post('/api/customerSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function supplierLogin(expectedHTTPStatus, data) {
    it('login supplier', function (done) {
        agent.post('/api/supplierSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function clerkLogin(expectedHTTPStatus, data) {
    it('login clerk', function (done) {
        agent.post('/api/clerkSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function qualityEmployeeLogin(expectedHTTPStatus, data) {
    it('login quality employee', function (done) {
        agent.post('/api/qualityEmployeeSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deliveryEmployeeLogin(expectedHTTPStatus, data) {
    it('login delivery employee', function (done) {
        agent.post('/api/deliveryEmployeeSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function logout(expectedHTTPStatus, data) {
    it('logout user', function (done) {
        agent.post('/api/logout')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function modifyUser(expectedHTTPStatus, data) {
    it('modify user', function (done) {
        agent.put('/api/users/' + data.username)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function deleteUser(expectedHTTPStatus, data) {
    it('delete user', function (done) {
        agent.delete('/api/users/' + data.username + '/' + data.type)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}