const dayjs = require('dayjs');


const sku = require('../warehouse/sku');
const skuItem = require('../warehouse/skuitem')
const restockOrder = require('../warehouse/restockorder')
const returnOrder = require('../warehouse/returnorder')

//SKU
const sku1 = {
    "description": "first new sku",
    "weight": 100,
    "volume": 50,
    "notes": "first SKU",
    "price": 10.99,
    "availableQuantity": 50,
    "position": null,
    "testDescriptors": []
}

const sku2 = {
    "description": "second new sku",
    "weight": 100,
    "volume": 50,
    "notes": "second SKU",
    "price": 10.99,
    "availableQuantity": 50,
    "position": null,
    "testDescriptors": []
}

const sku12 = {
    "id": 12,
    "description": "a product",
    "weight": 100,
    "volume": 50,
    "notes": "first SKU",
    "price": 10.99,
    "availableQuantity": 50,
    "position": null,
    "testDescriptors": []
}

const sku29 = {
    "id": 29,
    "description": "a very special product",
    "weight": 130,
    "volume": 13,
    "notes": "second SKU",
    "price": 29.99,
    "availableQuantity": 50,
    "position": null,
    "testDescriptors": []
}

const sku180 = {
    "id": 180,
    "description": "another product",
    "weight": 100,
    "volume": 50,
    "notes": "second SKU",
    "price": 11.99,
    "availableQuantity": 50,
    "position": null,
    "testDescriptors": []
}

//SKUITEM
const skuItem1 = {
    "skuid": 1,
    "rfid": "12345678901234567890123456789015",
    "dateofstock": dayjs().format("YYYY/MM/DD HH:mm")
}
const setReturnForSku1 = {
    "rfid": "12345678901234567890123456789015",
    "restockOrderId": 2,
    "returnOrderId": 1
}

const skuItem2 = {
    "skuid": 2,
    "rfid": "12345678901234567890123456789017",
    "dateofstock": dayjs().format("YYYY/MM/DD HH:mm")
}
const setReturnForSku2 = {
    "rfid": "12345678901234567890123456789017",
    "restockOrderId": 2,
    "returnOrderId": 1
}

const skuItem3 = {
    "skuid": 12,
    "rfid": "12345678901234567890123456789016",
    "dateofstock": dayjs().format("YYYY/MM/DD HH:mm")
}

const skuItem4 = {
    "skuid": 180,
    "rfid": "12345678901234567890123456789038",
    "dateofstock": dayjs().format("YYYY/MM/DD HH:mm")
}

const skuItem29 = {
    "skuid": 29,
    "rfid": "12345678901234567890123456789029",
    "dateofstock": dayjs().format("YYYY/MM/DD HH:mm")
}

//RETURNORDER
const returnOrder1 = {
    id: 1,
    returnDate: dayjs().format("YYYY/MM/DD HH:mm"),
    restockOrderId: 2,
    products: [],
}

const returnOrder1products = [
    { SKUId: 1, rfid: "12345678901234567890123456789015", "returnOrderID": 1, "DateOfStock": dayjs().format("YYYY/MM/DD HH:mm") },
    { SKUId: 2, rfid: "12345678901234567890123456789017", "returnOrderID": 1, "DateOfStock": dayjs().format("YYYY/MM/DD HH:mm") }
]

const returnOrder2 = {
    id: 2,
    returnDate: dayjs("2021/11/29 09:33").format("YYYY/MM/DD HH:mm"),
    products: [],
    restockOrderId: 1
}
const returnOrder2products = [
    { SKUId: 12, RFID: "12345678901234567890123456789016", "returnOrderID": 2, "DateOfStock": dayjs().format("YYYY/MM/DD HH:mm") },
    { SKUId: 180, RFID: "12345678901234567890123456789038", "returnOrderID": 2, "DateOfStock": dayjs().format("YYYY/MM/DD HH:mm") }
]

const returnOrder3 = {
    id: 3,
    returnDate: dayjs("2022/01/29 09:30").format("YYYY/MM/DD HH:mm"),
    products: [
        { SKUId: 29, description: "a very special product", price: 29.99, RFID: "12345678901234567890123456789029" }
    ],

    restockOrderId: 2
}

const returnOrderNoMatch = {
    id: 2,
    returnDate: dayjs().format("YYYY/MM/DD HH:mm"),
    products: [],
    restockOrderId: 15
}

const returnOrderNoProducts = {
    id: 2,
    returnDate: dayjs().format("YYYY/MM/DD HH:mm"),
    restockOrderId: 1
}

const returnOrderFakeDate = {
    id: 12500,
    returnDate: "proprio ora!",
    restockOrderId: 2
}

//POST RETURN ORDER

const postReturnOrder2 = {
    "returnDate": "2021/11/29 09:33",
    "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }],
    "restockOrderId": 1
}

const postReturnOrder3 = {
    "returnDate": "2022/01/29 09:30",
    "products": [{ "SKUId": 29, "description": "a very special product", "price": 29.99, "RFID": "12345678901234567890123456789029" }],
    "restockOrderId": 2
}

//RESTOCKORDER
const restockOrder1 = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "ISSUED",
    products: [],
    supplierId: 1,
    transportNote: { "deliveryDate": "2021/12/29" },
    skuItems: []
}

const restockOrder2 = {
    id: 2,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "ISSUED",
    products: [],
    supplierId: 1,
    transportNote: { "deliveryDate": "1955/01/26" },
    skuItems: []
}


describe('test RETURN ORDER apis', () => {

    beforeEach(async () => {
        await sku.deleteAllSkus();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
        await returnOrder.deleteOrders();

        await sku.resetSkuAutoIncrement();
        await returnOrder.resetAutoIncrement();
        await restockOrder.resetAutoIncrement();
        await restockOrder.resetProductAutoIncrement();

        await sku.storeSku(sku1)
        await sku.storeSku(sku2)
        await sku.storeSkuWithId(sku12)
        await sku.storeSkuWithId(sku29)
        await sku.storeSkuWithId(sku180)
        await skuItem.storeSkuitem(skuItem1);
        await skuItem.storeSkuitem(skuItem2);
        await skuItem.storeSkuitem(skuItem3);
        await skuItem.storeSkuitem(skuItem4);
        await skuItem.storeSkuitem(skuItem29);
        await skuItem.setReturn(setReturnForSku1)
        await skuItem.setReturn(setReturnForSku2)
        await returnOrder.storeOrder(returnOrder1);
        await returnOrder.storeOrder(returnOrder2);
        await restockOrder.storeOrder(restockOrder1);
        await restockOrder.storeOrder(restockOrder2);
    });
    afterAll(async () => {
        await sku.deleteAllSkus();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
        await returnOrder.deleteOrders();

        await sku.resetSkuAutoIncrement();
        await returnOrder.resetAutoIncrement();
        await restockOrder.resetAutoIncrement();
        await restockOrder.resetProductAutoIncrement();
    });

    //TESTS
    getOrders();
    getProducts(returnOrder1,returnOrder1products)
    getProducts(returnOrder2,[])
    getOrderById(returnOrder1)
    getOrderById(returnOrder2)
    deleteOrderWithId(returnOrder1)
    deleteOrderWithId(returnOrder2)
    deleteOrders()
    /*
    getReturnOrders(200);
    getReturnOrderById(200, returnOrder1)
    getReturnOrderByIdNotFound(404, returnOrder2)
    getReturnOrderByIdNotFound(422, {id: "unIdMoltoInappropriato"})
    postOrderWithNoMatchingRestock(404, returnOrderNoMatch)
    postOrderWithNoProductVect(422, returnOrderNoProducts)
    postNewOrderWithEmptyRequest(422)
    postOrderWrongDate(422, returnOrderFakeDate)
    postNewOrder(201,postReturnOrder2) //same restock order id as return 1
    postNewOrder(201,postReturnOrder3) //different restock order id (both have to work)
    getReturnOrderById(200, returnOrder2)
    getReturnOrderById(200, returnOrder3)
    deleteOrder(204, returnOrderFakeDate) //deleting an order which does not exists
    deleteOrder(204, returnOrder1)*/
});

async function getOrders() {
    test('get all return orders', async () => {
        let res = await returnOrder.getOrders();
        expect(res).toEqual([returnOrder1, returnOrder2]);
    });
}

async function getProducts(order,products) {
    test('get all return orders', async () => {
        let res = await skuItem.getStoredSkuitemsForReturnOrder(order);
        expect(res).toEqual(products);
    });
}

async function getOrderById(order) {
    test('get return order with id = ' + order.id, async () => {
        let res = await returnOrder.getOrderById(order);
        expect(res).toEqual(order);
    });
}

async function deleteOrderWithId(order) {
    test('delete order with id = ' + order.id, async () => {
        await returnOrder.deleteOrder(order);
        let res = await returnOrder.getOrderById(order)
        expect(res).toEqual(undefined);
    });
}

async function deleteOrders() {
    test('delete all orders', async () => {
        await returnOrder.deleteOrders();
        let res = await returnOrder.getOrders()
        expect(res).toEqual([]);
    });
}