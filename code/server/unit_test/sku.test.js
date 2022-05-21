const skuFunctions = require('../warehouse/sku');

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

 const sku3 = {
    "description" : "third sku",
     "weight" : 100,
     "volume" : 50,
     "notes" : "third SKU",
     "availableQuantity" : 50,
     "price" : 10.99,
     position : null,
     testDescriptors : []
 }


const nonExistingSku = {
    rfid:"00045678901234567890123456789015",
    skuid:1,
    available:1,
    dateofstock:"2021/11/29 12:30"
}


describe("skuitems", () => {

    beforeEach(async () => {
        await skuFunctions.deleteAllSkus();
        await skuFunctions.resetSkuAutoIncrement(); //resetto id dei prossimi inserimenti (ripartiranno da 1)

        await skuFunctions.storeSku(sku1);
        await skuFunctions.storeSku(sku2);
        await skuFunctions.storeSku(sku3);
    });

    testSku(sku1,1);
    testSku(sku2,2);
    testSku(sku3,3);
    testNotExistSku(52); //id non esistente per gli sku
    testSkus([sku1,sku2,sku3]);
    testIsNotThereSku(52);
    testIsThereSku(1);
    testDeleteSku(sku2, 2);
    testEditSkuWithTestDescriptors(sku3,3);
    testEditSkuWithoutTestDescriptors(sku3,3);
    testModifySkuPosition(sku2, 2, "111122223333");
    testSkuPositionAlreadyAssigned(2,"111122223333",false);
});

async function testSku(s,sid) {
    test('get sku', async () => {
        let res = await skuFunctions.getStoredSku({ id: sid });
        s.id = sid;
        expect(res).toEqual(s);
    });
}

async function testSkus(skulist) {
    test('get skus', async () => {
        for (let i=0; i<skulist.length; ++i){
            skulist[i].id=i+1;
        }
        let res = await skuFunctions.getStoredSkus();
        expect(res).toEqual(skulist);
    });
}

async function testNotExistSku(id) {
    test('get not inserted sku', async () => {
        let res = await skuFunctions.getStoredSku({ id: id });
        expect(res).toEqual(undefined);
    });
}

async function testIsThereSku(id) {
    test('sku present', async () => {
        let res = await skuFunctions.isThereSku({ id: id });
        expect(res).toEqual(1);
    });
}

async function testIsNotThereSku(id) {
    test('sku not present', async () => {
        let res = await skuFunctions.isThereSku({ id: id });
        expect(res).toEqual(0);
    });
}

async function testDeleteSku(s, sid) {
    test('delete sku', async () => {
        let res0 = await skuFunctions.getStoredSku({ id: sid });
        s.id=sid;
        expect(res0).toEqual(s);
        let res1 = await skuFunctions.deleteStoredSku({ id: sid });
        expect(res1).toEqual(undefined);
        let res2 = await skuFunctions.getStoredSku({ id: sid });
        expect(res2).toEqual(undefined);
    });
}

async function testEditSkuWithTestDescriptors(s,sid) {
    test('editSku with test descriptors', async () => {
        const modifySku = {
            "id": sid,
            "newDescription" : "a newwwwwwww sku",
            "newWeight" : 800,
            "newVolume" : 20,
            "newNotes" : "modifieeeed SKU",
            "newPrice" : 0.99,
            "newAvailableQuantity" : 510,
            "newTestDescriptors" : [1,7,9,98]
        }        
        await skuFunctions.modifyStoredSku(modifySku);
        let res = await skuFunctions.getStoredSku({ id: sid });
        expect(res).toEqual({
            id: sid,
            "description" : "a newwwwwwww sku",
            "weight" : 800,
            "volume" : 20,
            "notes" : "modifieeeed SKU",
            "price" : 0.99,
            "availableQuantity" : 510,
            "testDescriptors" : [1,7,9,98],
            "position": s.position
        });
    });
}

async function testEditSkuWithoutTestDescriptors(s,sid) {
    test('editSku without test descriptors', async () => {
        const modifySku = {
            "id": sid,
            "newDescription" : "a newwwwwwww sku",
            "newWeight" : 800,
            "newVolume" : 20,
            "newNotes" : "modifieeeed SKU",
            "newPrice" : 0.99,
            "newAvailableQuantity" : 510
        }        
        await skuFunctions.modifyStoredSku(modifySku);
        let res = await skuFunctions.getStoredSku({ id: sid });
        expect(res).toEqual({
            id: sid,
            "description" : "a newwwwwwww sku",
            "weight" : 800,
            "volume" : 20,
            "notes" : "modifieeeed SKU",
            "price" : 0.99,
            "availableQuantity" : 510,
            "position": s.position,
            "testDescriptors": s.testDescriptors
        });
    });
}

async function testModifySkuPosition(s, sid, pos) {
    test('modify position of an sku', async () => {
        let res0 = await skuFunctions.getStoredSku({ id: sid });
        s.id=sid;
        expect(res0).toEqual(s);
        await skuFunctions.modifySkuPosition({ id: sid, newPosition: pos });
        let res1 = await skuFunctions.getStoredSku({ id: sid });
        s.position = pos;
        expect(res1).toEqual(s);
    });
}

async function testSkuPositionAlreadyAssigned(sid, pos, expectedResult) {
    test('sku position already assigned to another sku', async () => {
        res = await skuFunctions.isPositionAlreadyAssignedToOtherSku({ id: sid, newPosition: pos });
        expect(res).toEqual(expectedResult);
    });
}