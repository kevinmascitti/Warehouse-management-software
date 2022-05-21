/*const testD = require('../warehouse/testDescriptor');


const testD1 = {
    id: 1,
    name: "TestD1",
    procedureDescription: "Quality test",
    idSKU: 1
}

const testD2 = {
    id: 2,
    name: "TestD2",
    procedureDescription: "Weight test",
    idSKU: 3
}

const testD3 = {
    id: 3,
    name: "TestD3",
    procedureDescription: "Quality test",
    idSKU: 2
}

const testD4 = {
    id: 4,
    name: "TestD4",
    procedureDescription: "Functional test",
    idSKU: 1
}

describe("testDescriptors", () => {

    beforeEach(async () => {
        await testD.deleteAllTestDescriptors();
        await testD.storeTestDescriptor(testD1);
        await testD.storeTestDescriptor(testD2);
        await testD.storeTestDescriptor(testD3);
    });

    testTestDescriptors(testD1);
    testTestDescriptors(testD2);
    testTestDescriptors(testD3);
    testNotExistTestDescriptor(testD4);
    testTestDescriptors();
    testIsNotThereTestDescriptor(testD4);
    testIsThereTestDescriptor(testD2);
    testDeleteTestDescriptor(testD2);
    testDuplicatedTestDescriptor(testD1);
    testEditTestDescriptor(testD2);
});

async function testTestDescriptors(i) {
    test('get testDescriptor', async () => {
        let res = await testD.getStoredTestDescriptor({ id: i.id });
        expect(res).toEqual({
            id: i.id,
            description: i.name,
            procedureDescription: i.procedureDescription,
            idSKU: i.idSKU
        });
    });
}

async function testTestDescriptors() {
    test('get testDescriptors', async () => {
        let res = await testD.getStoredTestDescriptor();
        expect(res).toEqual([testD1,testD2,testD3]);
    });
}

async function testNotExistTestDescriptor(i) {
    test('get not inserted item', async () => {
        let res = await testD.getStoredTestDescriptor({ id: i.id });
        expect(res).toEqual(undefined);
    });
}

async function testDuplicatedTestDescriptor(i) {
    test('duplicated testDescriptor', async () => {
        try{
            await testD.storeTestDescriptor(i);
        }
        catch(err){
            expect(err.toString()).toEqual('Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: TESTDESCRIPTOR.ID');   
        }
    });
}

async function testIsThereTestDescriptor(i) {
    test('testDescriptor present', async () => {
        let res = await testD.isThereTestDescriptor({ id: i.id });
        expect(res).toEqual(1);
    });
}

async function testIsNotThereTestDescriptor(i) {
    test('testDescriptor not present', async () => {
        let res = await testD.isThereTestDescriptor({ id: i.id });
        expect(res).toEqual(0);
    });
}

async function testDeleteTestDescriptor(i) {
    test('delete testDescriptor', async () => {
        let res0 = await testD.getStoredTestDescriptor({ id: i.id });
        expect(res0).toEqual({
            id: i.id,
            description: i.name,
            procedureDescription: i.procedureDescription,
            idSKU: i.idSKU
        });
        let res1 = await testD.deleteStoredTestDescriptor({ id: i.id });
        expect(res1).toEqual(undefined);
        let res2 = await testD.getStoredTestDescriptor({id: i.id});
        expect(res2).toEqual(undefined);
    });
}

    async function testEditTestDescriptor(i) {
        test('edit testDescriptor', async () => {
            const modifyItem = {
                id: i.id,
                newName: "edited testDescriptor",
                newProcedureDescription: "Testing Testing",
                newIdSKU: 1
            }
            await testD.modifyStoredTestDescriptor(modifyItem);
            let res = await testD.getStoredTestDescriptor({ id: modifyItem.id });
            expect(res).toEqual({
                id: i.id,
                name: modifyItem.newName,
                procedureDescription: modifyItem.newProcedureDescription,
                idSKU: modifyItem.newIdSKU
            });
        });
    }

   */ 
