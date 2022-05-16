const item = require('../warehouse/item');


describe("get items", () => {

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

    beforeEach(async () => {
        await item.deleteAllItems();

        await item.storeItem(item1);
        await item.storeItem(item2);
        await item.storeItem(item3);
    });

    testItem(item1);
    testItem(item2);
    testItem(item3);
});

async function testItem(i) {
    test('get item', async () => {
        let res = await item.getStoredItem({ id: i.id });
        expect(res[0]).toEqual({
            id: i.id,
            description: i.description,
            price: i.price,
            SKUId: i.SKUId,
            supplierId: i.supplierId
        });
    });
}
