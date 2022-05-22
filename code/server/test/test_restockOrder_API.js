const chai = require('chai');
const chaiHttp = require('chai-http');
const dayjs = require('dayjs');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const item = require('../warehouse/item');
const skuItem = require('../warehouse/skuitem')
const restockOrder = require('../warehouse/restockorder')

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

//SKUITEM
const skuItem1 = {
    skuid:12,
    rfid:"12345678901234567890123456789016",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setReturnForSku1 = {
    rfid:"12345678901234567890123456789016",
    restockOrderId: 2
}

const skuItem2 = {
    skuid:180,
    rfid:"12345678901234567890123456789017",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setReturnForSku2 = {
    rfid:"12345678901234567890123456789017",
    restockOrderId: 2
}

//RESTOCKORDERS
 const restockOrder1 = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state : "ISSUED",
    products: [],
    supplierId : 1,
    transportNote:{"deliveryDate":"2021/12/29"},
    skuItems : []
}

const restockOrder2 = {
    id: 2,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state : "COMPLETED",
    products: [],
    supplierId : 10,
    transportNote:{"deliveryDate":"quandoVuoi"},
    skuItems : []
}

const stateOrder2 = {
    id: 2,
    state: "COMPLETED"
}

const setRestockOrderProduct1 = {
    itemId: 1,
    restockOrderId: 2,
    quantity: 10
}

describe('test restockorder apis', () => {

    before(async () => {
        await item.deleteAllItems();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();

        await item.storeItem(item1);
        await item.storeItem(item2);
        await skuItem.storeSkuitem(skuItem1);
        await skuItem.storeSkuitem(skuItem2);
        await restockOrder.storeOrder(restockOrder1);

        await restockOrder.storeOrder(restockOrder2);
        await restockOrder.setNewState(stateOrder2);
        await skuItem.setRestockOrder(setReturnForSku1);
        await skuItem.setRestockOrder(setReturnForSku2);
    });

    after(async () => {
        await item.deleteAllItems();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
    });

    //TESTS
    //getRestockOrders(200); //ritorna ordine
});
