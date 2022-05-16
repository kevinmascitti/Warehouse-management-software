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

describe("get items", () => {

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

async function testNotExistItem(i) {
    test('get not inserted item', async () => {
        let res = await item.getStoredItem({ id: i.id });
        expect(res).toEqual(undefined);
    });
}

describe("modify items", () => {

    beforeEach(async () => {
        await item.deleteAllItems();

        await item.storeItem(item1);
        await item.storeItem(item2);
        await item.storeItem(item3);
    });

    describe("edit item data", () => {
        test('editItem', async () => {
            const modifyItem = {
                id: 1,
                newDescription: "edited item",
                newPrice: 999.47,
            }

            await item.modifyStoredItem(modifyItem);
            let res = await item.getStoredItem({ id: modifyItem.id });
            expect(res).toEqual({
                id: item2.id,
                description: modifyItem.newDescription,
                price: modifyItem.newPrice,
                SKUId: item2.SKUId,
                supplierId: item2.supplierId
            });
        })
    });
});

