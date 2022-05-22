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
const returnOrder = require('../warehouse/returnorder')

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
    id: 1,
    description: "another product",
    price: 11.99,
    SKUId: 180,
    supplierId: 5
};

//SKUITEM
const skuItem1 = {
    skuid: 12,
    rfid: "12345678901234567890123456789016",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setRestockForSku1 = {
    rfid: "12345678901234567890123456789016",
    restockOrderId: 2
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
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setRestockForSku12 = {
    rfid: "12345678901234567890123456789012",
    restockOrderId: 2
}


//RESTOCKORDERS
const restockOrder1 = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "ISSUED",
    products: [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }],
    supplierId: 1,
    transportNote: { "deliveryDate": "2021/12/29" },
    skuItems: []
}

const restockOrder2 = {
    id: 2,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state: "COMPLETED",
    products: [{ "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }],
    supplierId: 2,
    transportNote: { "deliveryDate": "quandoVuoi" },
    skuItems: [{ "SKUId": 12, "rfid": "12345678901234567890123456789012" }, { "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 180, "rfid": "12345678901234567890123456789017" }]
}

const stateOrder2 = {
    id: 2,
    state: "COMPLETED"
}

const restockOrderProduct1 = {
    itemId: 1,
    restockOrderId: 1,
    quantity: 30
}

const restockOrderProduct2 = {
    itemId: 2,
    restockOrderId: 2,
    quantity: 20
}



describe('test restockorder apis', () => {

    before(async () => {
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
        await skuItem.storeSkuitem(skuItem1);
        await skuItem.storeSkuitem(skuItem2);
        await skuItem.storeSkuitem(skuItem3);
        await skuItem.storeSkuitem(skuItem12);

        await restockOrder.storeOrder(restockOrder1);
        await restockOrder.storeOrder(restockOrder2);
        await restockOrder.storeProduct(restockOrderProduct1)
        await restockOrder.storeProduct(restockOrderProduct2)


        await restockOrder.setNewState(stateOrder2);
        await skuItem.setRestockOrder(setRestockForSku1);
        await skuItem.setRestockOrder(setRestockForSku2);
        await skuItem.setRestockOrder(setRestockForSku3);
        await skuItem.setRestockOrder(setRestockForSku12);
    });
    /*
        after(async () => {
            await item.deleteAllItems();
            await skuItem.deleteAllSkuitems();
            await restockOrder.deleteAllOrders();
            await restockOrder.deleteAllProducts();
            await returnOrder.deleteOrders();
    
            await returnOrder.resetAutoIncrement();
            await restockOrder.resetAutoIncrement();
            await restockOrder.resetProductAutoIncrement();
        });*/

    //TESTS
    getRestockOrders(200); //return all orders
    getRestockOrdersIssued(200) //return just issued orders
    getRestockOrderById(200, restockOrder2) //return restock with id = 2
    getRestockOrderByIdWrong(422, {id: "fake"}) //return restock with id = 2
    getRestockOrderByIdWrong(404, {id: 3}) //return restock with id = 2

});

function getRestockOrders(expectedHTTPStatus) {
    it.only('get all restock orders', function (done) {
        agent.get('/api/RestockOrders/')
            .then(function (r) {
                //console.log(r.body[1])
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(2)
                r.body[0].id.should.equal(restockOrder1.id)
                r.body[0].issueDate.should.equal(restockOrder1.issueDate)
                r.body[0].state.should.equal(restockOrder1.state)
                r.body[0].supplierId.should.equal(restockOrder1.supplierId)

                r.body[0].products.length.should.equal(1)
                r.body[0].products[0].SKUId.should.equal(restockOrder1.products[0].SKUId)
                r.body[0].products[0].description.should.equal(restockOrder1.products[0].description)
                r.body[0].products[0].price.should.equal(restockOrder1.products[0].price)
                r.body[0].products[0].qty.should.equal(restockOrder1.products[0].qty)

                r.body[0].skuItems.length.should.equal(0)

                r.body[1].id.should.equal(restockOrder2.id)
                r.body[1].issueDate.should.equal(restockOrder2.issueDate)
                r.body[1].state.should.equal(restockOrder2.state)
                r.body[1].supplierId.should.equal(restockOrder2.supplierId)

                r.body[1].products.length.should.equal(1)
                r.body[1].products[0].SKUId.should.equal(restockOrder2.products[0].SKUId)
                r.body[1].products[0].description.should.equal(restockOrder2.products[0].description)
                r.body[1].products[0].price.should.equal(restockOrder2.products[0].price)
                r.body[1].products[0].qty.should.equal(restockOrder2.products[0].qty)

                r.body[1].skuItems.length.should.equal(3)
                r.body[1].skuItems[0].SKUId.should.equal(restockOrder2.skuItems[0].SKUId)
                r.body[1].skuItems[0].rfid.should.equal(restockOrder2.skuItems[0].rfid)
                r.body[1].skuItems[1].SKUId.should.equal(restockOrder2.skuItems[1].SKUId)
                r.body[1].skuItems[1].rfid.should.equal(restockOrder2.skuItems[1].rfid)
                r.body[1].skuItems[2].SKUId.should.equal(restockOrder2.skuItems[2].SKUId)
                r.body[1].skuItems[2].rfid.should.equal(restockOrder2.skuItems[2].rfid)
                done();
            });
    });
}

function getRestockOrdersIssued(expectedHTTPStatus) {
    it.only('get restock orders issued', function (done) {
        agent.get('/api/RestockOrdersIssued/')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(1)

                r.body[0].id.should.equal(restockOrder1.id)
                r.body[0].issueDate.should.equal(restockOrder1.issueDate)
                r.body[0].state.should.equal(restockOrder1.state)
                r.body[0].supplierId.should.equal(restockOrder1.supplierId)

                r.body[0].products.length.should.equal(1)
                r.body[0].products[0].SKUId.should.equal(restockOrder1.products[0].SKUId)
                r.body[0].products[0].description.should.equal(restockOrder1.products[0].description)
                r.body[0].products[0].price.should.equal(restockOrder1.products[0].price)
                r.body[0].products[0].qty.should.equal(restockOrder1.products[0].qty)

                r.body[0].skuItems.length.should.equal(0)
                done();
            });
    });
}

function getRestockOrderById(expectedHTTPStatus, order) {
    it.only('get restock order by id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id)
            .then(function (r) {
                //console.log(r.body)
                //console.log(order.id)
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.equal(order.id)
                r.body.issueDate.should.equal(order.issueDate)
                r.body.state.should.equal(order.state)
                r.body.supplierId.should.equal(order.supplierId)

                r.body.products.length.should.equal(order.products.length)
                for (let i = 0; i < r.body.products.length; i++) {
                    r.body.products[i].SKUId.should.equal(order.products[i].SKUId)
                    r.body.products[i].description.should.equal(order.products[i].description)
                    r.body.products[i].price.should.equal(order.products[i].price)
                    r.body.products[i].qty.should.equal(order.products[i].qty)
                }

                r.body.skuItems.length.should.equal(order.skuItems.length)
                for (let i = 0; i < r.body.products.length; i++) {
                    r.body.skuItems[i].SKUId.should.equal(order.skuItems[i].SKUId)
                    r.body.skuItems[i].rfid.should.equal(order.skuItems[i].rfid)
                }
                done();
            });
    });
}

function getRestockOrderByIdWrong(expectedHTTPStatus, order) {
    it.only('get restock order (FAILS) by id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getRestockOrderById(expectedHTTPStatus, order) {
    it.only('get restock order by id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id + "/returnItems")
            .then(function (r) {
                console.log(r.body)
                //console.log(order.id)
                done();
            });
    });
}