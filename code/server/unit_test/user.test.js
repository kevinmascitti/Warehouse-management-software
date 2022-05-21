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
        let res = await user.getStoredUser({ id: i.id });
        expect(res).toEqual({
            id: i.positionID,
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
        let res = await user.getUser({ id: i.id });
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
        let res = await position.isThereUser({ id: i.id });
        expect(res).toEqual(0);
    });
}

async function testDeleteUser(i) {
    test('delete user', async () => {
        let res0 = await user.getUser({ id: i.id });
        expect(res0).toEqual({
            id: i.id,
            username: i.username,
            name: i.name,
            surname: i.surname,
            type: i.type
        });
        let res1 = await user.deleteUser({ id: i.id });
        expect(res1).toEqual(undefined);
        let res2 = await user.getUser({id: i.id});
        expect(res2).toEqual(undefined);
    });
}

async function testModifyPosition(i) {
    test('modify position', async () => {
        const modifyPosition = {
            positionID: "111111111111",
            newAisleID: "1111",
            newRow: "1111",
            newCol: "1111",
            newMaxWeight: 200,
            newMaxVolume: 600,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        }
        await position.modifyPosition(modifyItem);
        let res = await position.getPosition({ positionID: modifyPosition.positionID });
        expect(res).toEqual({
            positionID: "111111111111",
            aisleID: "1111",
            row: "1111",
            col: "1111",
            maxWeight: 200,
            maxVolume: 600,
            occupiedWeight: 200,
            occupiedVolume: 100
        });
    });
}

async function testModifyPositionID(i) {
    test('modify positionID', async () => {
        const modifyPositionID = {
            positionID: "111111111111",
            newPositionID: "222222222222"
        }
        await position.modifyPositionID(modifyPositionID);
        let res0 = await position.getPosition({ positionID: modifyPositionID.positionID });
        let res1 = await position.getPosition({ positionID: modifyPositionID.newPositionID });
        expect(res1).toEqual({
            positionID: "222222222222",
            aisleID: "2222",
            row: "2222",
            col: "2222",
            maxWeight: res0.maxWeight,
            maxVolume: res0.maxVolume,
            occupiedWeight: res0.occupiedWeight,
            occupiedVolume: res0.occupiedVolume
        });
    });
}
