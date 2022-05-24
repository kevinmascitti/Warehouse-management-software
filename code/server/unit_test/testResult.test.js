const testR = require('../warehouse/testResult');
const testD = require('../warehouse/testDescriptor');
const skuI = require('../warehouse/skuitem');
const sku = require('../warehouse/sku');

const sku1 = {
    description: "Sku1",
    weight: 100,
    volume: 50,
    notes: "note",
    price: 10.99,
    availableQuantity: 50
}

const sku2 = {
    description: "Sku2",
    weight: 4,
    volume: 1,
    notes: "note",
    price: 87.56,
    availableQuantity: 5
}

const skuI1 = {
    rfid: "12345678901234567890123456789014",
    skuid: 1,
    Available: 0,
    dateofstock: "2021/11/29 12:30"
}

const testD1 = {
    id: 1,
    name: "Meow1",
    procedureDescription: "Second test",
    idSKU: 1
};

const testD2 = {
    id: 2,
    name: "Meow2",
    procedureDescription: "Second test",
    idSKU: 2
};

const testR1 = {
    id: 1,
    idTestDescriptor: 1,
    Date: "2021/11/29",
    Result: "0",
    rfid: "12345678901234567890123456789014"
};

const testR2 = {
    id: 2,
    idTestDescriptor: 2,
    Date: "2021/10/12",
    Result: "1",
    rfid: "12345678901234567890123456789014"
};

describe("testDescriptors", () => {

    beforeEach(async () => {
        await testR.deleteAllTestResults();
        await testR.resetTestResultAutoIncrement();
        await testD.deleteAllTestDescriptors();
        await testD.resetTestDescriptorAutoIncrement();
        await skuI.deleteAllSkuitems();
        await sku.deleteAllSkus();
        await sku.resetSkuAutoIncrement();
        await sku.storeSku(sku1);
        await sku.storeSku(sku2);
        await skuI.storeSkuitem(skuI1);
        await testD.storeTestDescriptor(testD1);
        await testD.storeTestDescriptor(testD2);
        await testR.storeTestResult(testR1);
        await testR.storeTestResult(testR2);
    });

    testTestResult(testR1);
    testTestResult(testR2);
    testNotExistingTestResult({id: 99, rfid:"12345678901234567890123456789011"});
    testTestResults([testR1, testR2]);
    testIsThereTestResult(testR1);
    testEditTestResult(testR1);
    testDeleteTestResult(testR1);
    testDeleteAllTestResults(testR1.rfid);

});

async function testTestResult(t) {
    test('get testResult', async () => {
        let res = await testR.getStoredTestResult({ id: t.id, rfid: t.rfid });
        expect(res).toEqual({
            id: t.id,
            idTestDescriptor: t.idTestDescriptor,
            Date: t.Date,
            Result: t.Result
        });
    });
}

async function testNotExistingTestResult(id, rfid) {
    test('get non existing testResult', async () => {
        let res = await testR.getStoredTestResult({ id: id, rfid: rfid });
        expect(res).toEqual(undefined);
    });
}

async function testTestResults(tests) {
    test('get all testResults for rfid', async () => {
        let res = await testR.getStoredTestResults({ rfid: tests[0].rfid });
        for (let i = 0; i < tests.length; ++i){
            expect(res[i].id).toEqual(tests[i].id);
            expect(res[i].idTestDescriptor).toEqual(tests[i].idTestDescriptor);
            expect(res[i].Date).toEqual(tests[i].Date);
            expect(res[i].Result).toEqual(tests[i].Result);
        }
    });
}

async function testIsThereTestResult(t) {
    test('testResult exists', async () => {
        let res = await testR.isThereTestResult({ id: t.id });
        expect(res).toEqual(1);
    });
}

async function testEditTestResult(t) {
    test('edit testResult', async () => {
        const modifyTest = {
            id: t.id,
            rfid: t.rfid,
            newIdTestDescriptor: 2,
            newDate: "2021/12/30",
            newResult: "0"
        }
        await testR.modifyStoredTestResult(modifyTest);
        let res = await testR.getStoredTestResult({ id: modifyTest.id, rfid: modifyTest.rfid });
        expect(res).toEqual({
            id: t.id,
            idTestDescriptor: modifyTest.newIdTestDescriptor,
            Date: modifyTest.newDate,
            Result: modifyTest.newResult
        });
    });
}

async function testDeleteTestResult(t) {
    test('delete testResult', async () => {
        let res1 = await testR.deleteStoredTestResult({ id: t.id, rfid: t.rfid });
        expect(res1).toEqual(undefined);
        let res2 = await testR.getStoredTestResult({ id: t.id, rfid: t.rfid });
        expect(res2).toEqual(undefined);
    });
}

async function testDeleteAllTestResults(rfid) {
    test('delete all testDescriptors', async () => {
        let res1 = await testR.deleteAllTestResults();
        expect(res1).toEqual(undefined);
        let res = await testR.getStoredTestResults({ rfid: rfid });
        expect(res).toEqual([]);
    });
}
