const skuitem = require('../warehouse/skuitem');


const skuitem1 = {
    rfid: "12345678901234567890123456789014",
    skuid: 1,
    available: 0,
    dateofstock: "2021/11/29 12:30"
}

const skuitem2 = {
    rfid:"99345678901234567890123456789015",
    skuid:1,
    available:0,
    dateofstock:"2021/11/29 12:30"
}


const nonExistingSkuitem = {
    rfid:"00045678901234567890123456789015",
    skuid:1,
    available:1,
    dateofstock:"2021/11/29 12:30"
}


describe("items", () => {

    beforeEach(async () => {
        await skuitem.deleteAllSkuitems();

        await skuitem.storeSkuitem(skuitem1);
        await skuitem.storeSkuitem(skuitem2);
    });

    testSkuitem(skuitem1);
    testSkuitem(skuitem2);
    testNotExistSkuitem(nonExistingSkuitem);
    testSkuitems();
    testIsNotThereSkuitem(nonExistingSkuitem);
    testIsThereSkuitem(skuitem2);
    testDeleteSkuitem(skuitem2);
    testDuplicatedSkuitem(skuitem1);
    testEditSkuitem(skuitem2);
    testGetSkuitemsBySkuid(skuitem1.skuid);
});

async function testSkuitem(i) {
    test('get skuitem', async () => {
        let res = await skuitem.getStoredSkuitem({ rfid: i.rfid });
        expect(res).toEqual({
            RFID: i.rfid,
            SKUId: i.skuid,
            Available: 0,
            DateOfStock: i.dateofstock
        });
    });
}

async function testGetSkuitemsBySkuid(skuid) {
    test('get available skuitem by skuid', async () => {
        let res = await skuitem.getStoredSkuitemsForSkuid({ id: skuid });
        expect(res).toEqual([]);
        const modifySkuitem = {
            newRFID: skuitem1.rfid,
            newAvailable: 1,
            newDateOfStock: "2021/11/29 12:30",
            oldRFID: skuitem1.rfid
        }
        await skuitem.modifyStoredSkuitem(modifySkuitem);
        let res2 = await skuitem.getStoredSkuitemsForSkuid({ id: skuid });
        let expectedRes2 = {
            RFID: modifySkuitem.newRFID,
            SKUId: skuid,
            DateOfStock: modifySkuitem.newDateOfStock
        }
        expect(res2).toEqual(
                [expectedRes2]
            );
    });
}

async function testSkuitems() {
    test('get skuitems', async () => {
        let res = await skuitem.getStoredSkuitems();
        expect(res[0].RFID).toEqual(skuitem1.rfid);
        expect(res[1].RFID).toEqual(skuitem2.rfid);
    });
}

async function testNotExistSkuitem(i) {
    test('get not inserted skuitem', async () => {
        let res = await skuitem.getStoredSkuitem({ rfid: i.rfid });
        expect(res).toEqual(undefined);
    });
}

async function testDuplicatedSkuitem(i) {
    test('duplicated skuitem', async () => {
        try {
            await skuitem.storeSkuitem(i);
        }
        catch (err) {
            expect(err.toString()).toEqual('Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: SKUITEM.RFID');
        }
    });
}

async function testIsThereSkuitem(i) {
    test('skuitem present', async () => {
        let res = await skuitem.isThereSkuitem({ rfid: i.rfid });
        expect(res).toEqual(1);
    });
}

async function testIsNotThereSkuitem(i) {
    test('skuitem not present', async () => {
        let res = await skuitem.isThereSkuitem({ rfid: i.rfid });
        expect(res).toEqual(0);
    });
}

async function testDeleteSkuitem(i) {
    test('delete skuitem', async () => {
        let res0 = await skuitem.getStoredSkuitem({ rfid: i.rfid });
        expect(res0).toEqual({
            RFID: i.rfid,
            SKUId: i.skuid,
            Available: 0,
            DateOfStock: i.dateofstock
        });
        let res1 = await skuitem.deleteStoredSkuitem({ rfid: i.rfid });
        expect(res1).toEqual(undefined);
        let res2 = await skuitem.getStoredSkuitem({ rfid: i.rfid });
        expect(res2).toEqual(undefined);
    });
}

async function testEditSkuitem(i) {
    test('editSkutem', async () => {
        const modifySkuitem = {
            newRFID: "00000078901234567890123456789015",
            newAvailable: 1,
            newDateOfStock: "2021/11/29 12:30",
            oldRFID: i.rfid
        }
        await skuitem.modifyStoredSkuitem(modifySkuitem);
        let res = await skuitem.getStoredSkuitem({ rfid: modifySkuitem.newRFID });
        expect(res).toEqual({
            RFID: modifySkuitem.newRFID,
            SKUId: i.skuid,
            Available: modifySkuitem.newAvailable,
            DateOfStock: modifySkuitem.newDateOfStock
        });
    });
}

