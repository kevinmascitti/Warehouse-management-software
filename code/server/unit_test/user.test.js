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

const user1test = {
    id: 6,
    username: "deliveryEmployee99@ezwh.com",
    name: "Simon",
    surname: "Lebon",
    password: "testpassword",
    type: "deliveryEmployee"
}

const user2test= {
    id: 7,
    username: "customer99@ezwh.com",
    name: "Zack",
    surname: "Smart",
    password: "testpassword",
    type: "customer"
}

const user3test = {
    id: 8,
    username: "supplier99@ezwh.com",
    name: "Freddie",
    surname: "Sa",
    password: "testpassword",
    type: "supplier"
}

const user4test = {
    id: 9,
    username: "clerk99@ezwh.com",
    name: "Man",
    surname: "Ze",
    password: "testpassword",
    type: "clerk"
}

describe('test user apis', () => {
    
    beforeEach(async () => {
        await user.deleteAllUsers();
        await user.storeUser(user1);
        await user.storeUser(user2);
        await user.storeUser(user3);
        await user.storeUser(user4);
        await user.resetUserAutoincrement();
    });
    
    testUser(user1test);
    testUser(user2test);
    testUser(user3test);
    testUser(user4test);
    testNotExistUser(user5);
    testUsers([user1test,user2test,user3test,user4test]);
    testSuppliers([user3test]);
    testIsNotThereUser(user5);
    testIsThereUser(user2);
    testDuplicatedUser(user1);
    testDeleteUser(user2);
    testModifyUser(user4test);
});

async function testUser(i) {
    test('get user', async () => {
        let res = await user.getUser({ username: i.username, type: i.type });
        expect(res).toEqual({
            id: i.id,
            username: i.username,
            name: i.name,
            surname: i.surname,
            type: i.type
        });
    });
}

async function testUsers(data) {
    test('get users', async () => {
        let res = await user.getStoredUsers();
        for (let i=0; i<data.length; ++i){
            expect(res[i].id).toEqual(data[i].id);
            expect(res[i].name).toEqual(data[i].name);
            expect(res[i].surname).toEqual(data[i].surname);
            expect(res[i].email).toEqual(data[i].username);
            expect(res[i].type).toEqual(data[i].type);
        }
    });
}

async function testSuppliers(data) {
    test('get suppliers', async () => {
        let res = await user.getStoredSuppliers();
         for (let i=0; i<data.length; ++i){
            expect(res[i].id).toEqual(data[i].id);
            expect(res[i].name).toEqual(data[i].name);
            expect(res[i].surname).toEqual(data[i].surname);
            expect(res[i].email).toEqual(data[i].username);
        }
    });
}

async function testNotExistUser(i) {
    test('get not inserted user', async () => {
        let res = await user.getUser({ username: i.username, type: i.type });
        expect(res).toEqual(undefined);
    });
}

async function testDuplicatedUser(i) {
    test('duplicated user', async () => {
        try{
            await user.storeUser(i);
        }
        catch(err){
            expect(err.toString()).toEqual('Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: USER.ID');   
        }
    });
}

async function testIsThereUser(i) {
    test('user present', async () => {
        let res = await user.isThereUser({ username: i.username, type: i.type });
        expect(res).toEqual(1);
    });
}

async function testIsNotThereUser(i) {
    test('user not present', async () => {
        let res = await user.isThereUser({ username: i.username, type: i.type });
        expect(res).toEqual(0);
    });
}

async function testDeleteUser(i) {
    test('delete user', async () => {
        let res1 = await user.deleteStoredUser({ username: i.username, type: i.type });
        expect(res1).toEqual(undefined);
        let res2 = await user.getUser({ username: i.username, type: i.type });
        expect(res2).toEqual(undefined);
    });
}

async function testModifyUser(i) {
    test('modify user', async () => {
        const modifyUser = {
            username: "clerk99@ezwh.com",
            oldType: "clerk",
            newType: "deliveryEmployee"
        }
        await user.modifyRightsStoredUser(modifyUser);
        let res = await user.getUser({ username: modifyUser.username, type: modifyUser.newType });
        expect(res).toEqual({
            id: i.id,
            username: modifyUser.username,
            name: i.name,
            surname: i.surname,
            type: modifyUser.newType
        });
    });
}