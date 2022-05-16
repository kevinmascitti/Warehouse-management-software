const item = require('../warehouse/item');


const item1 = {
    id: 0,
    description: "the very first item",
    price: 15.99,
    SKUId: 1,
    supplierId: 1
}

const item2 = {
    id: 1,
    description: "second item",
    price: 10.99,
    SKUId: 2,
    supplierId: 1
}

const item3 = {
    id: 2,
    description: "third item",
    price: 9.99,
    SKUId: 1,
    supplierId: 2
}

const item4 = {
    id: 833,
    description: "no item",
    price: 9.99,
    SKUId: 1,
    supplierId: 2
}

describe("items", () => {

    beforeEach(async () => {
        await item.deleteAllItems();

        await item.storeItem(item1);
        await item.storeItem(item2);
        await item.storeItem(item3);
    });

    testItem(item1);
    testItem(item2);
    testItem(item3);
    testNotExistItem(item4);
    testItems();
    testIsNotThereItem(item4);
    testIsThereItem(item2);
    testDeleteItem(item2);
    testDuplicatedItem(item1);
    testEditItem(item2);
});

async function testItem(i) {
    test('get item', async () => {
        let res = await item.getStoredItem({ id: i.id });
        expect(res).toEqual({
            id: i.id,
            description: i.description,
            price: i.price,
            SKUId: i.SKUId,
            supplierId: i.supplierId
        });
    });
}

async function testItems() {
    test('get items', async () => {
        let res = await item.getStoredItems();
        expect(res).toEqual([item1,item2,item3]);
    });
}

async function testNotExistItem(i) {
    test('get not inserted item', async () => {
        let res = await item.getStoredItem({ id: i.id });
        expect(res).toEqual(undefined);
    });
}

async function testDuplicatedItem(i) {
    test('duplicated item', async () => {
        try{
            await item.storeItem(i);
        }
        catch(err){
            expect(err.toString()).toEqual('Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: ITEM.ID');   
        }
    });
}

async function testIsThereItem(i) {
    test('item present', async () => {
        let res = await item.isThereItem({ id: i.id });
        expect(res).toEqual(1);
    });
}

async function testIsNotThereItem(i) {
    test('item not present', async () => {
        let res = await item.isThereItem({ id: i.id });
        expect(res).toEqual(0);
    });
}

async function testDeleteItem(i) {
    test('delete item', async () => {
        let res0 = await item.getStoredItem({ id: i.id });
        expect(res0).toEqual({
            id: i.id,
            description: i.description,
            price: i.price,
            SKUId: i.SKUId,
            supplierId: i.supplierId
        });
        let res1 = await item.deleteStoredItem({ id: i.id });
        expect(res1).toEqual(undefined);
        let res2 = await item.getStoredItem({id: i.id});
        expect(res2).toEqual(undefined);
    });
}

    async function testEditItem(i) {
        test('editItem', async () => {
            const modifyItem = {
                id: i.id,
                newDescription: "edited item ohohoh",
                newPrice: 999.47,
            }
            await item.modifyStoredItem(modifyItem);
            let res = await item.getStoredItem({ id: modifyItem.id });
            expect(res).toEqual({
                id: i.id,
                description: modifyItem.newDescription,
                price: modifyItem.newPrice,
                SKUId: i.SKUId,
                supplierId: i.supplierId
            });
        });
    }

    
