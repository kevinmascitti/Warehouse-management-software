const dayjs = require('dayjs');

const item = require('../warehouse/item');
const skuItem = require('../warehouse/skuitem')
const restockOrder = require('../warehouse/restockorder')
const returnOrder = require('../warehouse/returnorder');
const { should } = require('chai');

//ITEM
const item1 = {
    id: 1,
    description: "a product",
    price: 10.99,
    SKUId: 12,
    supplierId: 1
};

const item2 = {
    id: 2,
    description: "another product",
    price: 11.99,
    SKUId: 180,
    supplierId: 2
};

const item3 = {
    id: 3,
    description: "a product",
    price: 10.99,
    SKUId: 12,
    supplierId: 2
};

const item4 = {
    id: 4,
    description: "an item corresponding to first sku",
    price: 0.99,
    SKUId: 1,
    supplierId: 4
};

const item5 = {
    id: 5,
    description: "another product",
    price: 11.99,
    SKUId: 180,
    supplierId: 1
};

//SKUITEM
const skuItem1 = {
    skuid: 12,
    rfid: "12345678901234567890123456789016",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setRestockForSku1 = {
    rfid: "12345678901234567890123456789016",
    restockOrderId: 2,
    returnOrderId: 1
}

const skuItem2 = {
    skuid: 180,
    rfid: "12345678901234567890123456789017",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setRestockForSku2 = {
    rfid: "12345678901234567890123456789017",
    restockOrderId: 2
}

const skuItem3 = {
    skuid: 3,
    rfid: "12345678901234567890123456789003",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setRestockForSku3 = {
    rfid: "12345678901234567890123456789003",
    restockOrderId: 1
}

const skuItem12 = {
    skuid: 12,
    rfid: "12345678901234567890123456789012",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm"),
}
const setRestockForSku12 = {
    rfid: "12345678901234567890123456789012",
    restockOrderId: 2,
    returnOrderId: 1
}

const skuItem153 = {
    skuid: 180,
    rfid: "12345678901234567890123456789153",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}

const skuItem154 = {
    skuid: 180,
    rfid: "12345678901234567890123456789154",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}


//RESTOCKORDERS
const restockOrder1 = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "ISSUED",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }],
    supplierId: 1,
    transportNote: undefined,
    skuItems: []
}

const restockOrder1newState = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "DELIVERY",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }],
    supplierId: 1,
    transportNote: undefined,
    skuItems: []
}

const restockOrder2 = {
    id: 2,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "COMPLETEDRETURN",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }]
    ,
    supplierId: 2,
    transportNote: undefined,
    skuItems: [{ "SKUId": 12, "rfid": "12345678901234567890123456789012" }, { "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 180, "rfid": "12345678901234567890123456789017" }],
    returnItems: [{ SKUId: 12, rfid: '12345678901234567890123456789012' }, { SKUId: 12, rfid: '12345678901234567890123456789016' }]
}

const restockOrder3 = {
    id: 3,
    issueDate: dayjs("2021/11/29 09:33").format("YYYY/MM/DD HH:mm"),
    state: "ISSUED",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }]
    ,
    supplierId: 1,
    transportNote: undefined,
    skuItems: [],
    returnItems: []
}

const restockOrder3newState = {
    id: 3,
    issueDate: dayjs("2021/11/29 09:33").format("YYYY/MM/DD HH:mm"),
    state: "DELIVERED",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }]
    ,
    supplierId: 1,
    transportNote: undefined,
    skuItems: [],
    returnItems: []
}

const stateOrder2 = {
    id: 2,
    state: "COMPLETEDRETURN"
}

const restockOrderProduct1 = {
    id: 1,
    itemId: 1,
    restockOrderId: 1,
    quantity: 30
}

const restockOrderProduct2 = {
    id: 2,
    itemId: 2,
    restockOrderId: 2,
    quantity: 20
}

const restockOrderProduct3 = {
    id: 3,
    itemId: 3,
    restockOrderId: 2,
    quantity: 30
}

const restockPost3 = {
    "issueDate": "2021/11/29 09:33",
    "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }],
    "supplierId": 1
}

const restockPut3 = {
    "skuItems": [{ "SKUId": 180, "rfid": "12345678901234567890123456789153" },
    { "SKUId": 180, "rfid": "12345678901234567890123456789154" }]
}

const restockOrder3newItems = {
    id: 3,
    issueDate: dayjs("2021/11/29 09:33").format("YYYY/MM/DD HH:mm"),
    state: "DELIVERED",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }]
    ,
    supplierId: 1,
    transportNote: undefined,
    skuItems: restockPut3.skuItems,
    returnItems: []
}

const transportNote1 = { "transportNote": { "deliveryDate": dayjs().format("YYYY/MM/DD HH:mm") } }

const restockOrder1newTransport = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "DELIVERY",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }],
    supplierId: 1,
    transportNote: transportNote1.transportNote,
    skuItems: []
}

//RETURN ORDER
const returnOrder1 = {
    id: 1,
    returnDate: dayjs().format("YYYY/MM/DD HH:mm"),
    restockOrderId: 2,
    products: [
        { SKUId: 12, description: "a product", price: 10.99, RFID: "12345678901234567890123456789012" },
        { SKUId: 12, description: "another product", price: 11.99, RFID: "12345678901234567890123456789016" }
    ],
}


describe('test restockorder apis', () => {

    beforeEach(async () => {
        await item.deleteAllItems();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
        await returnOrder.deleteOrders();

        await returnOrder.resetAutoIncrement();
        await restockOrder.resetAutoIncrement();
        await restockOrder.resetProductAutoIncrement();

        await item.storeItem(item1);
        await item.storeItem(item2);
        await item.storeItem(item3);
        await item.storeItem(item4);
        await item.storeItem(item5);
        await skuItem.storeSkuitem(skuItem1);
        await skuItem.storeSkuitem(skuItem2);
        await skuItem.storeSkuitem(skuItem3);
        await skuItem.storeSkuitem(skuItem12);
        await skuItem.storeSkuitem(skuItem153);
        await skuItem.storeSkuitem(skuItem154);

        await restockOrder.storeOrder(restockOrder1);
        await restockOrder.storeOrder(restockOrder2);
        await restockOrder.storeProduct(restockOrderProduct1)
        await restockOrder.storeProduct(restockOrderProduct2)
        await restockOrder.storeProduct(restockOrderProduct3)
        await returnOrder.storeOrder(returnOrder1)


        await restockOrder.setNewState(stateOrder2);
        await skuItem.setRestockOrder(setRestockForSku2);
        await skuItem.setReturn(setRestockForSku1); //so i insert the return order
        await skuItem.setRestockOrder(setRestockForSku3);
        await skuItem.setReturn(setRestockForSku12); //same
    });
    afterAll(async () => {
        await item.deleteAllItems();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
        await returnOrder.deleteOrders();

        await returnOrder.resetAutoIncrement();
        await restockOrder.resetAutoIncrement();
        await restockOrder.resetProductAutoIncrement();
    });

    //TESTS
    //get orders
    getOrders();
    getOrdersIssued();
    getOrderById(restockOrder1);
    getOrderById(restockOrder2);
    //get products
    getProducts(restockOrder1, [restockOrderProduct1]);
    getProducts(restockOrder2, [restockOrderProduct2,restockOrderProduct3]);

});

async function getOrders() {
    test('get all restock orders', async () => {
        let res = await restockOrder.getOrders();
        expect(res).toEqual([{
            id: restockOrder1.id,
            issueDate: restockOrder1.issueDate,
            state: restockOrder1.state,
            products: [],
            supplierId: restockOrder1.supplierId,
            transportNote: restockOrder1.transportNote,
            skuItems: []
        },
        {
            id: restockOrder2.id,
            issueDate: restockOrder2.issueDate,
            state: restockOrder2.state,
            products: [],
            supplierId: restockOrder2.supplierId,
            transportNote: restockOrder2.transportNote,
            skuItems: []
        }
    ]);
    });
}


async function getOrdersIssued() {
    test('get issued restock orders', async () => {
        let res = await restockOrder.getOrdersIssued();
        expect(res).toEqual([{
            id: restockOrder1.id,
            issueDate: restockOrder1.issueDate,
            state: restockOrder1.state,
            products: [],
            supplierId: restockOrder1.supplierId,
            transportNote: restockOrder1.transportNote,
            skuItems: []
        }]);
    });
}


async function getOrderById(order) {
    test('get restock order with id = ' + order.id, async () => {
        let res = await restockOrder.getOrderById(order);
        expect(res).toEqual({
            id: order.id,
            issueDate: order.issueDate,
            state: order.state,
            products: [],
            supplierId: order.supplierId,
            transportNote: order.transportNote,
            skuItems: []
        });
    });
}


async function getProducts(order,products) {
    test('get restock order products', async () => {
        let res = await restockOrder.getProducts(order.id);
        expect(res).toEqual(
            products);
    });
}