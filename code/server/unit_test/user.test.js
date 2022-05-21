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

describe('test user apis', () => {
    
    before(async () => {
        await user.deleteAllUsers();
        await user.storeUser(user1);
        await user.storeUser(user2);
        await user.storeUser(user3);
        await user.storeUser(user4);
    });
    
    testUser(user1);
    testUser(user2);
    testUser(user3);
    testUser(user4);
    testNotExistUser(user5);
    testUsers([user1,user2,user3,user4]);
    testSuppliers([user3]);
    testIsNotThereUser(user5);
    testIsThereUser(user2);
    testDuplicatedUser(user1);
    testDeleteUser(user2);
    testIsNotThereUser(user2);
    testModifyUser(user1);
});

async function testUser(i) {
    test('get user', async () => {
        let res = await user.getStoredUser({ username: i.username });
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
        expect(res).toEqual(data);
    });
}

async function testSuppliers(data) {
    test('get users', async () => {
        let res = await user.getStoredSuppliers();
        expect(res).toEqual(data);
    });
}

async function testNotExistUser(i) {
    test('get not inserted user', async () => {
        let res = await user.getStoredUser({ username: i.username });
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
        let res = await user.isThereUser({ id: i.id });
        expect(res).toEqual(1);
    });
}

async function testIsNotThereUser(i) {
    test('user not present', async () => {
        let res = await user.isThereUser({ id: i.id });
        expect(res).toEqual(0);
    });
}

async function testDeleteUser(i) {
    test('delete user', async () => {
        let res0 = await user.getStoredUser({ id: i.id });
        expect(res0).toEqual({
            id: i.id,
            username: i.username,
            name: i.name,
            surname: i.surname,
            type: i.type
        });
        let res1 = await user.deleteStoredUser({ username: i.username, type: i.type});
        expect(res1).toEqual(undefined);
        let res2 = await user.getStoredUser({username: i.username});
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
        let res = await user.getStoredUser({ username: modifyUser.username });
        expect(res).toEqual({
            id: res.id,
            username: "clerk99@ezwh.com",
            name: res.name,
            surname: res.surname,
            type: modifyUser.newType
        });
    });
}