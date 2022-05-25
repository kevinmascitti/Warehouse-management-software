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
    products: [{"SKUId":180,"description":"another product","price":11.99,"qty":20}, {"SKUId":12,"description":"a product","price":10.99,"qty":30}]
,
    supplierId: 2,
    transportNote: undefined,
    skuItems: [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 180, "rfid": "12345678901234567890123456789017" }, { "SKUId": 12, "rfid": "12345678901234567890123456789012" }],
    returnItems: [{ SKUId: 12, rfid: '12345678901234567890123456789016' },{ SKUId: 12, rfid: '12345678901234567890123456789012' } ]
}

const restockOrder3 = {
    id: 3,
    issueDate: dayjs("2021/11/29 09:33").format("YYYY/MM/DD HH:mm"),
    state: "ISSUED",
    products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
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
    products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
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
    itemId: 1,
    restockOrderId: 1,
    quantity: 30
}

const restockOrderProduct2 = {
    itemId: 2,
    restockOrderId: 2,
    quantity: 20
}

const restockOrderProduct3 = {
    itemId: 3,
    restockOrderId: 2,
    quantity: 30
}

const restockPost3 = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
        "supplierId" : 1
}

const restockPut3 = {
    "skuItems" : [{"SKUId":180,"rfid":"12345678901234567890123456789153"},
    {"SKUId":180,"rfid":"12345678901234567890123456789154"}]
}

const restockOrder3newItems = {
    id: 3,
    issueDate: dayjs("2021/11/29 09:33").format("YYYY/MM/DD HH:mm"),
    state: "DELIVERED",
    products: [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}]
,
    supplierId: 1,
    transportNote: undefined,
    skuItems: restockPut3.skuItems,
    returnItems: []
}

const transportNote1 ={"transportNote":{"deliveryDate":dayjs().format("YYYY/MM/DD HH:mm")}} 

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
        {SKUId: 12,description: "a product",price:10.99,RFID:"12345678901234567890123456789012"},
        {SKUId: 12,description: "another product",price:11.99,RFID:"12345678901234567890123456789016"}
    ],
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
        after(async () => {
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
    getRestockOrders(200); //return all orders
    getRestockOrdersIssued(200) //return just issued orders
    getRestockOrderById(200, restockOrder2) //return restock with id = 2
    getRestockOrderByIdWrong(422, {id: "fake"}) //return restock with id = 2
    getRestockOrderByIdWrong(404, {id: 3}) //return restock with id = 2
    //get items to return (previously stored)
    getReturnItemsByRestock(200, restockOrder2)
    getReturnItemsByRestockWrong(422, {id: "somelighttrolling"})
    getReturnItemsByRestockWrong(404, {id: 134567543})
    getReturnItemsByRestockWrong(404, {id: 50}) //order not found
    getReturnItemsByRestockWrong(422, restockOrder1) //status is not COMPLETEDRETURN
    //post new restock order
    postNewRestockOrder(201, restockPost3)
    getRestockOrderById(200, restockOrder3) //return restock with id = 3
    //put new state
    putNewState(200,restockOrder3,{newState: 'DELIVERED'});
    getRestockOrderById(200, restockOrder3newState)
    putNewState(422,restockOrder3,{newState: 'Delivered'});
    putNewState(422,{id: "unIdMoltoInappropriato"},{newState: 'DELIVERED'});
    putNewState(404,{id: 13536325},{newState: 'DELIVERED'});
    //put new skuItems
    putSkuItems(422,{id: "unIdMoltoInappropriato"},restockPut3)
    putSkuItems(404,{id: 13463467},restockPut3)
    putSkuItems(422,restockOrder3,{"skuItems" : []})
    putSkuItems(422,restockOrder3,{"skuItems" : "abs"})
    putSkuItems(200,restockOrder3newState,restockPut3)
    getRestockOrderById(200, restockOrder3newItems)
    //put transport note
    putTransportNote(422,{id: "unIdMoltoInappropriato"},transportNote1);
    putTransportNote(404,{id: 13536325},transportNote1);
    putTransportNote(422,restockOrder1,transportNote1) //fails cause state is still ISSUED
    putNewState(200,restockOrder1,{newState: 'DELIVERY'});
    getRestockOrderById(200, restockOrder1newState) //state successfully changed
    putTransportNote(422,restockOrder1, {"transportNote":{"deliveryDate":"1066/6/25"}}) //fails because delivery date earlier than isse date
    putTransportNote(200,restockOrder1, transportNote1)
    checkTransportNote(200,restockOrder1newTransport)
    putNewState(200,restockOrder1,{newState: 'DELIVERED'});
    putTransportNote(422,restockOrder1, transportNote1) //fails because state not DELIVERY anymore
    //delete order
    deleteOrder(204,restockOrder1newTransport);
    getRestockOrderByIdWrong(404,restockOrder1newTransport)


});

function getRestockOrders(expectedHTTPStatus) {
    it('get all restock orders', function (done) {
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

                r.body[1].products.length.should.equal(2)
                r.body[1].products[0].SKUId.should.equal(restockOrder2.products[0].SKUId)
                r.body[1].products[0].description.should.equal(restockOrder2.products[0].description)
                r.body[1].products[0].price.should.equal(restockOrder2.products[0].price)
                r.body[1].products[0].qty.should.equal(restockOrder2.products[0].qty)
                r.body[1].products[1].SKUId.should.equal(restockOrder2.products[1].SKUId)
                r.body[1].products[1].description.should.equal(restockOrder2.products[1].description)
                r.body[1].products[1].price.should.equal(restockOrder2.products[1].price)
                r.body[1].products[1].qty.should.equal(restockOrder2.products[1].qty)

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
    it('get restock orders issued', function (done) {
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
    it('get restock order by id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id)
            .then(function (r) {
                //if (r.body.id == 2) console.log(r.body)
                //if (r.body.id == 2) console.log(order)
                //console.log(order)
                //console.log(order.state)
                //console.log("Transportnote " + r.body.transportNote)
                //console.log("Transportnote 2 " + r.body.transportNote === order.transportNote)
                //console.log("Transportnote... " + order.transportNote)
                r.should.have.status(expectedHTTPStatus);
                r.body.id.should.equal(order.id)
                r.body.issueDate.should.equal(order.issueDate)
                r.body.state.should.equal(order.state)
                r.body.supplierId.should.equal(order.supplierId)
                //(r.body.transportNote == order.transportNote).should.equal(true)
                r.body.products.length.should.equal(order.products.length)
                let i = 0;
                while (i< r.body.products.length) {
                    r.body.products[i].SKUId.should.equal(order.products[i].SKUId)
                    r.body.products[i].description.should.equal(order.products[i].description)
                    r.body.products[i].price.should.equal(order.products[i].price)
                    r.body.products[i].qty.should.equal(order.products[i].qty)
                    i++
                }

                r.body.skuItems.length.should.equal(order.skuItems.length)
                i = 0;
                while (i< r.body.skuItems.length) {
                    r.body.skuItems[i].SKUId.should.equal(order.skuItems[i].SKUId)
                    r.body.skuItems[i].rfid.should.equal(order.skuItems[i].rfid)
                    i++
                }
                done();
            });
    });
}

function getRestockOrderByIdWrong(expectedHTTPStatus, order) {
    it('get restock order (FAILS) by id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function getReturnItemsByRestockWrong(expectedHTTPStatus, order) {
    it('get return items (FAIL) given id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id + "/returnItems")
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function getReturnItemsByRestock(expectedHTTPStatus, order) {
    it('get return items given id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id + "/returnItems")
            .then(function (r) {
                //console.log(r.body)
                //console.log(order)
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(order.returnItems.length)
                
                for(let i=0; i<r.body.length; i++){
                    r.body[i].rfid.should.equal(order.returnItems[i].rfid)
                    r.body[i].SKUId.should.equal(order.returnItems[i].SKUId)
                }
                done();
            });
    });
}


function postNewRestockOrder(expectedHTTPStatus, order) {
    it('post new restock order ', function (done) {
        agent.post('/api/RestockOrder/').send(order)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function putNewState(expectedHTTPStatus, order, state) {
    it('put new state ' + state.newState + ' to order '+ order.id, function (done) {
        agent.put('/api/RestockOrder/'+ order.id).send(state)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function putSkuItems(expectedHTTPStatus, order, items) {
    it('put skuItems to order '+ order.id, function (done) {
        agent.put('/api/RestockOrder/'+ order.id + "/skuItems").send(items)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function putTransportNote(expectedHTTPStatus, order, note) {
    it('put note to order '+ order.id, function (done) {
        agent.put('/api/RestockOrder/'+ order.id + "/transportNote").send(note)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function checkTransportNote(expectedHTTPStatus, order) {
    it('get restock order with TRANSPORT NOTE by id = ' + order.id, function (done) {
        agent.get('/api/RestockOrders/'  + order.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                //console.log(r.body)

                //console.log( r.body.transportNote.deliveryDate)
                //console.log(order.transportNote.deliveryDate)
                r.body.transportNote.deliveryDate.should.equal(order.transportNote.deliveryDate)

                r.body.id.should.equal(order.id)
                r.body.issueDate.should.equal(order.issueDate)
                r.body.state.should.equal(order.state)
                r.body.supplierId.should.equal(order.supplierId)

                r.body.products.length.should.equal(order.products.length)
                let i = 0;
                while (i< r.body.products.length) {
                    r.body.products[i].SKUId.should.equal(order.products[i].SKUId)
                    r.body.products[i].description.should.equal(order.products[i].description)
                    r.body.products[i].price.should.equal(order.products[i].price)
                    r.body.products[i].qty.should.equal(order.products[i].qty)
                    i++
                }

                r.body.skuItems.length.should.equal(order.skuItems.length)
                i = 0;
                while (i< r.body.skuItems.length) {
                    r.body.skuItems[i].SKUId.should.equal(order.skuItems[i].SKUId)
                    r.body.skuItems[i].rfid.should.equal(order.skuItems[i].rfid)
                    i++
                }
                done();
            });
    });
}


function deleteOrder(expectedHTTPStatus, order) {
    it('delete order '+ order.id, function (done) {
        agent.delete('/api/RestockOrder/'+ order.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}