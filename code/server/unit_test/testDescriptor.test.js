const testD = require('../warehouse/testDescriptor');
const sku = require('../warehouse/sku');

const sku1 = {
    "description" : "first sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "first SKU",
    "availableQuantity" : 50,
    "price" : 10.99,
    position : null,
    testDescriptors : []
}
 
const sku2 = {
    "description" : "second sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "second SKU",
    "availableQuantity" : 50,
    "price" : 10.99,
    position : null,
    testDescriptors : []
}

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
    idSKU: 2
}

const testD3 = {
    id: 3,
    name: "TestD3",
    procedureDescription: "Functional test",
    idSKU: 1
}

describe("testDescriptors", () => {

    beforeEach(async () => {
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
        await testD.deleteAllTestDescriptors();
        await testD.resetTestDescriptorAutoIncrement();
        await testD.storeTestDescriptor(testD1);
        await testD.storeTestDescriptor(testD2);
        await testD.storeTestDescriptor(testD3);
    });

    testTestDescriptor(testD1);
    testTestDescriptor(testD2);
    testTestDescriptor(testD3);
    testNotExistingTestDescriptor({id: 99}); //test non existing testDescriptor
    testTestDescriptors([testD1, testD2, testD3]); //test if all added testDescriptors are present
    testIsThereTestDescriptor(testD1); //test if added testDescriptor exists
    testEditTestDescriptor(testD1); //test if testDescriptor was modified
    testDeleteTestDescriptor(testD1); //test if testDescriptor was deleted
    testDeleteAllTestDescriptors(); //test if all testDescriptors are deleted

    afterAll(async () => {
        testD.resetTestDescriptorAutoIncrement();
        sku.deleteAllSkus();
        sku.resetSkuAutoIncrement();
    });
    
});

async function testTestDescriptor(t) {
    test('get testDescriptor', async () => {
        let res = await testD.getStoredTestDescriptor({ id: t.id });
        expect(res).toEqual({
            id: t.id,
            name: t.name,
            procedureDescription: t.procedureDescription,
            idSKU: t.idSKU
        });
    });
}

async function testNotExistingTestDescriptor(id) {
    test('get non existing testDescriptor', async () => {
        let res = await testD.getStoredTestDescriptor({ id: id });
        expect(res).toEqual(undefined);
    });
}

async function testTestDescriptors(tests) {
    test('get all testDescriptors', async () => {
        let res = await testD.getStoredTestDescriptors();
        for (let i = 0; i < tests.length; ++i){
            expect(res[i].id).toEqual(tests[i].id);
            expect(res[i].name).toEqual(tests[i].name);
            expect(res[i].procedureDescription).toEqual(tests[i].procedureDescription);
            expect(res[i].idSKU).toEqual(tests[i].idSKU);
        }
    });
}

async function testIsThereTestDescriptor(t) {
    test('testDescriptor exists', async () => {
        let res = await testD.isThereTestDescriptor({ id: t.id });
        expect(res).toEqual(1);
    });
}

async function testEditTestDescriptor(t) {
    test('edit testDescriptor', async () => {
        const modifyTest = {
            id: t.id,
            newName: "edited testDescriptor",
            newProcedureDescription: "Testing Testing",
            newIdSKU: 2
        }
        await testD.modifyStoredTestDescriptor(modifyTest);
        let res = await testD.getStoredTestDescriptor({ id: modifyTest.id });
        expect(res).toEqual({
            id: t.id,
            name: modifyTest.newName,
            procedureDescription: modifyTest.newProcedureDescription,
            idSKU: modifyTest.newIdSKU
        });
    });
}

async function testDeleteTestDescriptor(t) {
    test('delete testDescriptor', async () => {
        let res1 = await testD.deleteStoredTestDescriptor({ id: t.id });
        expect(res1).toEqual(undefined);
        let res2 = await testD.getStoredTestDescriptor({ id: t.id });
        expect(res2).toEqual(undefined);
    });
}

async function testDeleteAllTestDescriptors() {
    test('delete all testDescriptors', async () => {
        let res1 = await testD.deleteAllTestDescriptors();
        expect(res1).toEqual(undefined);
        let res = await testD.getStoredTestDescriptors();
        expect(res).toEqual([]);
    });
}