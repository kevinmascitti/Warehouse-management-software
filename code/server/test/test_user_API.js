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

const managerL = {
    username: "manager1@ezwh.com",
    password: "testpassword"
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
        await position.deleteAllUsers();
    });
    
    storeUser(201, user1); //user inserito
    storeUser(201, user2); //user inserito
    storeUser(201, user3); //user inserito
    storeUser(201, user4); //user inserito
    storeUser(201, user5); //user inserito
    storeUser(409, user5); //USER DUPLICATO ==> ERRORE

    storeUser(201, wrongUsername); //FORMATO USERNAME SBAGLIATO ===> ERRORE
    storeUser(201, wrongPassword); //FORMATO USERNAME SBAGLIATO ===> ERRORE
    
    getInfo(404, {username:"", password:""});
    
    getSuppliers(200, [user3]);
    getUsers(200, [user1, user2, user3, user4, user5]);
    
    managerLogin(401, wrongPassManagerL);
    managerLogin(200, managerL);
    getInfo(200, {username: "manager1@ezwh.com", type: "manager"});
    logout(200);
    deliveryEmployeeLogin(200, deliveryEmployeeL);
    logout(200);
    deliveryEmployeeLogin(401, wrongUserCustomerL);
    deliveryEmployeeLogin(200, customerL);
    logout(200);
    deliveryEmployeeLogin(401, wrongPassSupplierL);
    deliveryEmployeeLogin(200, supplierL);
    logout(200);
    deliveryEmployeeLogin(401, wrongUserClerkL);
    deliveryEmployeeLogin(200, clerkL);
    logout(200);
    deliveryEmployeeLogin(401, wrongUserQualityEmployeeL);
    deliveryEmployeeLogin(200, qualityEmployeeL);
    logout(200);

    modifyUser(200, modifyUserType); //modifico type
    modifyUser(422, modifyUserWrongType); //FORMATO SBAGLIATO ==> ERRORE
    modifyUser(422, modifyUserFromManager); //FORMATO SBAGLIATO ==> ERRORE
    modifyUser(404, modifyUserUnexistent); //USER INESISTENTE ==> ERRORE

    deleteUser(204, deleteUserType);
    deleteUser(422, deleteManager);
});
