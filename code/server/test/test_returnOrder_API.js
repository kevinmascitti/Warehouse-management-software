const chai = require('chai');
const chaiHttp = require('chai-http');
const dayjs = require('dayjs');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const sku = require('../warehouse/sku');
const skuItem = require('../warehouse/skuitem')
const restockOrder = require('../warehouse/restockorder')
const returnOrder = require('../warehouse/returnorder')

//SKU
const sku1 = {
    "description" : "first new sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "first SKU",
    "price" : 10.99,
    "availableQuantity" : 50,
    position : null,
    "testDescriptors" : []
}

const sku2 = {
    "description" : "second new sku",
    "weight" : 100,
    "volume" : 50,
    "notes" : "second SKU",
    "price" : 10.99,
    "availableQuantity" : 50,
    position : null,
    "testDescriptors" : []
}

//SKUITEM
const skuItem1 = {
    skuid:1,
    rfid:"12345678901234567890123456789016",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setReturnForSku1 = {
    rfid:"12345678901234567890123456789016",
    restockOrderId: 2,
    returnOrderId: 1
}

const skuItem2 = {
    skuid: 2,
    rfid:"12345678901234567890123456789017",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const setReturnForSku2 = {
    rfid:"12345678901234567890123456789017",
    restockOrderId: 2,
    returnOrderId: 1
}

//RETURNORDER
 const returnOrder1 = {
    id: 1,
    returnDate: dayjs().format("YYYY/MM/DD HH:mm"),
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
    restockOrderId: 15
}

//RESTOCKORDER
const restockOrder1 = {
    id: 1,
    issueDate: dayjs().format("YYYY/MM/DD HH:mm"),
    state : "ISSUED",
    products: [],
    supplierId : 1,
    transportNote:{"deliveryDate":"2021/12/29"},
    skuItems : []
}

describe('test RETURN ORDER apis', () => {

    before(async () => {
        await sku.deleteAllSkus();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
        await returnOrder.deleteOrders();

        await sku.resetSkuAutoIncrement();
        await returnOrder.resetAutoIncrement();
        await restockOrder.resetAutoIncrement();

        await sku.storeSku(sku1)
        await sku.storeSku(sku2)
        await skuItem.storeSkuitem(skuItem1);
        await skuItem.storeSkuitem(skuItem2);
        await skuItem.setReturn(setReturnForSku1)
        await skuItem.setReturn(setReturnForSku2)
        await returnOrder.storeOrder(returnOrder1);
        await restockOrder.storeOrder(restockOrder1);
    });
 /*
    after(async () => {
        await sku.deleteAllSkus();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAllOrders();
        await restockOrder.deleteAllProducts();
        await returnOrder.deleteOrders();
    });*/

    //TESTS
    getReturnOrders(200); //ritorna ordine
    getReturnOrderById(200, returnOrder1)
    putOrderWithNoMatchingRestock(404, returnOrderNoMatch)
    putOrderWithNoProductVect(422,returnOrderNoProducts)
});

function getReturnOrders(expectedHTTPStatus) {
    it('get return orders', function (done) {
        agent.get('/api/ReturnOrders/')
            .then(function (r) {
                //console.log(r.body)
                //console.log(r.body[1].skuItems)
                r.should.have.status(expectedHTTPStatus);
                r.body[0].id.should.equal(returnOrder1.id);
                r.body[0].returnDate.should.equal(returnOrder1.returnDate);
                r.body[0].restockOrderId.should.equal(returnOrder1.restockOrderId);

                r.body[0].products[0].SKUId.should.equal(skuItem1.skuid);
                r.body[0].products[0].RFID.should.equal(skuItem1.rfid);
                r.body[0].products[0].description.should.equal(sku1.description);
                r.body[0].products[0].price.should.equal(sku1.price);

                r.body[0].products[1].SKUId.should.equal(skuItem2.skuid);
                r.body[0].products[1].RFID.should.equal(skuItem2.rfid);
                r.body[0].products[1].description.should.equal(sku2.description);
                r.body[0].products[1].price.should.equal(sku2.price);
                done();
            });
    });
}


function getReturnOrderById(expectedHTTPStatus, order) {
    it('get return order by id', function (done) {
        agent.get('/api/ReturnOrders/' + order.id)
            .then(function (r) {
                //console.log(r.body)
                r.should.have.status(expectedHTTPStatus);
                r.body.returnDate.should.equal(order.returnDate);
                r.body.restockOrderId.should.equal(order.restockOrderId);

                r.body.products[0].SKUId.should.equal(skuItem1.skuid);
                r.body.products[0].RFID.should.equal(skuItem1.rfid);
                r.body.products[0].description.should.equal(sku1.description);
                r.body.products[0].price.should.equal(sku1.price);

                r.body.products[1].SKUId.should.equal(skuItem2.skuid);
                r.body.products[1].RFID.should.equal(skuItem2.rfid);
                r.body.products[1].description.should.equal(sku2.description);
                r.body.products[1].price.should.equal(sku2.price);
                done();
            });
    });
}


function putOrderWithNoMatchingRestock(expectedHTTPStatus, order) {
    it('put no matching restock', function (done) {
        agent.post('/api/ReturnOrder/').send(order)
            .then(function (r) {
                //console.log(r.body)
                r.should.have.status(expectedHTTPStatus);
               
                done();
            });
    });
}

function putOrderWithNoProductVect(expectedHTTPStatus, order) {
    it('put no product vect', function (done) {
        agent.post('/api/ReturnOrder/').send(order)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}