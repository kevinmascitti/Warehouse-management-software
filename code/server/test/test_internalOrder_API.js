const chai = require('chai');
const chaiHttp = require('chai-http');
const dayjs = require('dayjs');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const sku = require('../warehouse/sku');
const skuItem = require('../warehouse/skuitem')
const internalOrder = require('../warehouse/internalorder')
const { should } = require('chai');

//SKU
const sku12 = {
    "id": 12,
    "description": "a product",
    "weight": 100, //occupera esattamente tutta la posizione 5!!! (OK!)
    "volume": 80,
    "notes": "first SKU",
    "price": 10.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

const sku180 = {
    "id": 290,
    "description": "another product",
    "weight": 100, //occupera esattamente tutta la posizione 5!!! (OK!)
    "volume": 80,
    "notes": "first SKU",
    "price": 11.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

const sku1 = {
    "id": 1,
    "description": "first sku",
    "weight": 100, //occupera esattamente tutta la posizione 5!!! (OK!)
    "volume": 80,
    "notes": "first SKU",
    "price": 1.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

const sku29 = {
    "id": 29,
    "description": "another product",
    "weight": 100, //occupera esattamente tutta la posizione 5!!! (OK!)
    "volume": 80,
    "notes": "first SKU",
    "price": 11.99,
    "availableQuantity": 50,
    position: null,
    "testDescriptors": []
}

//SKUITEM
const skuItem1 = {
    skuid: 12,
    rfid: "12345678901234567890123456789016",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const skuItem2 = {
    skuid: 290,
    rfid: "12345678901234567890123456789039",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const skuItem3 = {
    skuid: 1,
    rfid: "12345678901234567890123456789003",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const skuItem4 = {
    skuid: 1,
    rfid: "12345678901234567890123456789012",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm"),
}
const skuItem180 = {
    skuid: 290,
    rfid: "12345678901234567890123456789180",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}
const skuItem29 = {
    skuid: 29,
    rfid: "12345678901234567890123456789029",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
}

const skuItem1order2 = {
    rfid: "12345678901234567890123456789016",
    internalOrderId: 2
}
const skuItem2order2 = {
    rfid: "12345678901234567890123456789039",
    internalOrderId: 2
}
const skuItem180order2 = {
    rfid: "12345678901234567890123456789180",
    internalOrderId: 2
}
const skuItem29order1 = {
    rfid: "12345678901234567890123456789029",
    internalOrderId: 1
}

//ORDERS
const order1 = {
    "id": 1,
    "issueDate": "2021/11/29 09:33",
    "state": "ACCEPTED",
    "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 2 },
    { "SKUId": 290, "description": "another product", "price": 11.99, "qty": 3 }],
    "customerId": 1
}
const order2 = {
    "id": 2,
    "issueDate": "2021/11/30 19:33",
    "state": "COMPLETED",
    "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 290, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789180" },
    { "SKUId": 290, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" }],
    "customerId": 1
}
const order3 = {
    "id": 3,
    "issueDate": dayjs().format("YYYY/MM/DD HH:mm"),
    "state": "ISSUED",
    "products": [{ "SKUId": 1, "description": "first sku", "price": 1.99, "qty": 10 }],
    "customerId": 1
}
const order4 = {
    "id": 4,
    "issueDate": "2021/11/29 19:00",
    "state": "ISSUED",
    "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":8},
    {"SKUId":290,"description":"another product","price":11.99,"qty":1}],
    "customerId": 5
}
const postOrder4 = {
        "issueDate":"2021/11/29 19:00",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":8},
                    {"SKUId":290,"description":"another product","price":11.99,"qty":1}],
        "customerId" : 5
}
const order4newState = {
    "id": 4,
    "issueDate": "2021/11/29 19:00",
    "state": "REFUSED",
    "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":8},
    {"SKUId":290,"description":"another product","price":11.99,"qty":1}],
    "customerId": 5
}
const setStateOrder3 = {
    "newState":"COMPLETED",
    "products":[{"SkuID":1,"RFID":"12345678901234567890123456789003"},{"SkuID":1,"RFID":"12345678901234567890123456789012"}]
}
const order3newState = {
    "id": 3,
    "issueDate": dayjs().format("YYYY/MM/DD HH:mm"),
    "state": "COMPLETED",
    "products": [{ "SKUId": 1, "description": "first sku", "price": 1.99, "RFID":"12345678901234567890123456789003"},{ "SKUId": 1, "description": "first sku", "price": 1.99,"RFID":"12345678901234567890123456789012"}],
    "customerId": 1
}
const order1newState = {
    "id": 1,
    "issueDate": "2021/11/29 09:33",
    "state": "COMPLETED",
    "products": [],
    "customerId": 1
}

const order1product1 = {
    id: 1,
    skuid: 12,
    quantity: 2
}
const order1product2 = {
    id: 1,
    skuid: 290,
    quantity: 3
}
const order2product1 = {
    id: 2,
    skuid: 12,
    quantity: 2 //irrilevante
}
const order2product2 = {
    id: 2,
    skuid: 290,
    quantity: 3 //irrilevante
}
const order3product1 = {
    id: 3,
    skuid: 1,
    quantity: 10
}

describe('test internalorder apis', () => {

    before(async () => {
        //CLEAR TABLES
        await sku.deleteAllSkus();
        await skuItem.deleteAllSkuitems();
        await internalOrder.deleteAllOrders();
        await internalOrder.deleteAllProducts();
        //RESET COUNTERS
        await sku.resetSkuAutoIncrement();
        await internalOrder.resetOrderAutoIncrement();
        await internalOrder.resetProductAutoIncrement();

        //STORE DATA
        await sku.storeSkuWithId(sku12)
        await sku.storeSkuWithId(sku29)
        await sku.storeSkuWithId(sku1)
        await sku.storeSkuWithId(sku180)
        await skuItem.storeSkuitem(skuItem180)
        await skuItem.storeSkuitem(skuItem1)
        await skuItem.storeSkuitem(skuItem29)
        await skuItem.storeSkuitem(skuItem3)
        await skuItem.storeSkuitem(skuItem4)
        await skuItem.storeSkuitem(skuItem2)
        await skuItem.setInternalOrder(skuItem29order1)
        await skuItem.setInternalOrder(skuItem1order2)
        await skuItem.setInternalOrder(skuItem180order2)
        await skuItem.setInternalOrder(skuItem2order2)
        await skuItem.setInternalOrder(skuItem180order2)
        await internalOrder.storeInternalOrder(order1)
        await internalOrder.storeInternalOrder(order2)
        await internalOrder.storeInternalOrder(order3)
        await internalOrder.storeInternalOrderProduct(order1product1)
        await internalOrder.storeInternalOrderProduct(order1product2)
        await internalOrder.storeInternalOrderProduct(order2product1)
        await internalOrder.storeInternalOrderProduct(order2product2)
        await internalOrder.storeInternalOrderProduct(order3product1)

    });
    after(async () => {
        await sku.deleteAllSkus();
        await skuItem.deleteAllSkuitems();
        await internalOrder.deleteAllOrders();
        await internalOrder.deleteAllProducts();

        await sku.resetSkuAutoIncrement();
        await internalOrder.resetOrderAutoIncrement();
        await internalOrder.resetProductAutoIncrement();
    });

    //TESTS
    //get orders
    getOrders(200);
    getOrdersIssued(200);
    getOrdersAccepted(200);
    getOrderById(200,order1)
    getOrderById(200,order2)
    getOrderById(200,order3)
    getOrderByIdWrong(404,{id:4})
    getOrderByIdWrong(422,{id:"unIdMoltoInappropriato"})
    //post orders
    postNewOrder(422,{issueDate: "tantotempofa"})
    postNewOrder(422,{issueDate: dayjs().format("YYYY/MM/DD HH:mm"), products: "fake"})
    postNewOrder(422,{issueDate: dayjs().format("YYYY/MM/DD HH:mm"), products: [], customerId: "unIdMoltoInappropriato"})
    postNewOrder(201,postOrder4)
    getOrderById(200,order4)
    //put orders
    editOrder(422,{id: "unIdMoltoInappropriato"}, {newState: "REFUSED"})
    editOrder(422,{id: 1}, {newState: "refused"})
    editOrder(404,{id: 123456765432}, {newState: "REFUSED"})
    editOrder(422,{id: 1}, {newState: "COMPLETED", products: "foo"})
    editOrder(200,order4newState,{newState: "REFUSED"})
    getOrderById(200,order4newState)
    editOrder(200,order3,setStateOrder3)
    getOrderById(200,order3newState)
    editOrder(200,order1,{newState: "COMPLETED", products: []})
    getOrderById(200,order1newState)
    //delete orders
    deleteOrder(204,order1)
    getOrderByIdWrong(404,order1)
    deleteOrder(422,{id: "unIdMoltoInappropriato"})


});

function getOrders(expectedHTTPStatus) {
   it('get all internal orders', function (done) {
        agent.get('/api/InternalOrders/')
            .then(function (r) {
                //console.log(r.body[1])
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(3)

                r.body[0].id.should.equal(order1.id)
                r.body[0].issueDate.should.equal(order1.issueDate)
                r.body[0].state.should.equal(order1.state)
                r.body[0].customerId.should.equal(order1.customerId)

                r.body[0].products.length.should.equal(order1.products.length)
                r.body[0].products[0].SKUId.should.equal(order1.products[0].SKUId)
                r.body[0].products[0].description.should.equal(order1.products[0].description)
                r.body[0].products[0].price.should.equal(order1.products[0].price)
                r.body[0].products[0].qty.should.equal(order1.products[0].qty)
                r.body[0].products[1].SKUId.should.equal(order1.products[1].SKUId)
                r.body[0].products[1].description.should.equal(order1.products[1].description)
                r.body[0].products[1].price.should.equal(order1.products[1].price)
                r.body[0].products[1].qty.should.equal(order1.products[1].qty)

                r.body[1].id.should.equal(order2.id)
                r.body[1].issueDate.should.equal(order2.issueDate)
                r.body[1].state.should.equal(order2.state)
                r.body[1].customerId.should.equal(order2.customerId)

                r.body[1].products.length.should.equal(order2.products.length)
                r.body[1].products[0].SKUId.should.equal(order2.products[0].SKUId)
                r.body[1].products[0].description.should.equal(order2.products[0].description)
                r.body[1].products[0].price.should.equal(order2.products[0].price)
                r.body[1].products[0].RFID.should.equal(order2.products[0].RFID)
                r.body[1].products[1].SKUId.should.equal(order2.products[1].SKUId)
                r.body[1].products[1].description.should.equal(order2.products[1].description)
                r.body[1].products[1].price.should.equal(order2.products[1].price)
                r.body[1].products[1].RFID.should.equal(order2.products[1].RFID)
                r.body[1].products[2].SKUId.should.equal(order2.products[2].SKUId)
                r.body[1].products[2].description.should.equal(order2.products[2].description)
                r.body[1].products[2].price.should.equal(order2.products[2].price)
                r.body[1].products[2].RFID.should.equal(order2.products[2].RFID)

                r.body[2].id.should.equal(order3.id)
                r.body[2].issueDate.should.equal(order3.issueDate)
                r.body[2].state.should.equal(order3.state)
                r.body[2].customerId.should.equal(order3.customerId)

                r.body[2].products.length.should.equal(order3.products.length)
                r.body[2].products[0].SKUId.should.equal(order3.products[0].SKUId)
                r.body[2].products[0].description.should.equal(order3.products[0].description)
                r.body[2].products[0].price.should.equal(order3.products[0].price)
                r.body[2].products[0].qty.should.equal(order3.products[0].qty)

                done();
            });
    });
}

function getOrdersAccepted(expectedHTTPStatus) {
   it('get all internal orders with state = ACCEPTED', function (done) {
        agent.get('/api/InternalOrdersAccepted/')
            .then(function (r) {
                //console.log(r.body)
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(1)

                r.body[0].id.should.equal(order1.id)
                r.body[0].issueDate.should.equal(order1.issueDate)
                r.body[0].state.should.equal(order1.state)
                r.body[0].customerId.should.equal(order1.customerId)

                r.body[0].products.length.should.equal(order1.products.length)
                r.body[0].products[0].SKUId.should.equal(order1.products[0].SKUId)
                r.body[0].products[0].description.should.equal(order1.products[0].description)
                r.body[0].products[0].price.should.equal(order1.products[0].price)
                r.body[0].products[0].qty.should.equal(order1.products[0].qty)
                r.body[0].products[1].SKUId.should.equal(order1.products[1].SKUId)
                r.body[0].products[1].description.should.equal(order1.products[1].description)
                r.body[0].products[1].price.should.equal(order1.products[1].price)
                r.body[0].products[1].qty.should.equal(order1.products[1].qty)

                done();
            });
    });
}

function getOrdersIssued(expectedHTTPStatus) {
   it('get all internal orders with state = ISSUED', function (done) {
        agent.get('/api/InternalOrdersIssued/')
            .then(function (r) {
                //console.log(r.body)
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(1)

                r.body[0].id.should.equal(order3.id)
                r.body[0].issueDate.should.equal(order3.issueDate)
                r.body[0].state.should.equal(order3.state)
                r.body[0].customerId.should.equal(order3.customerId)

                r.body[0].products.length.should.equal(order3.products.length)
                r.body[0].products[0].SKUId.should.equal(order3.products[0].SKUId)
                r.body[0].products[0].description.should.equal(order3.products[0].description)
                r.body[0].products[0].price.should.equal(order3.products[0].price)
                r.body[0].products[0].qty.should.equal(order3.products[0].qty)

                done();
            });
    });
}

function getOrderById(expectedHTTPStatus, order) {
   it('get internal order with id = ' + order.id, function (done) {
        agent.get('/api/InternalOrders/' + order.id)
            .then(function (r) {
                //if(r.body.id == 2) console.log(r.body)
                //if(order.id == 2) console.log(order)

                r.should.have.status(expectedHTTPStatus);

                r.body.id.should.equal(order.id)
                r.body.issueDate.should.equal(order.issueDate)
                r.body.state.should.equal(order.state)
                r.body.customerId.should.equal(order.customerId)

                r.body.products.length.should.equal(order.products.length)

                let i = 0;
                while (i< r.body.products.length) {
                    r.body.products[i].SKUId.should.equal(order.products[i].SKUId)
                    r.body.products[i].description.should.equal(order.products[i].description)
                    r.body.products[i].price.should.equal(order.products[i].price)
                    if (r.body.state != 'COMPLETED') r.body.products[i].qty.should.equal(order.products[i].qty)
                    else r.body.products[i].RFID.should.equal(order.products[i].RFID)
                    //else console.log(r.body.products)
                    i++
                }
                done();
            });
    });
}

function getOrderByIdWrong(expectedHTTPStatus, order) {
   it('get all internal order (FAILS) with id = ' + order.id, function (done) {
        agent.get('/api/InternalOrders/' + order.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function postNewOrder(expectedHTTPStatus, order) {
   it('post new internal order ', function (done) {
        agent.post('/api/internalOrders/').send(order)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function editOrder(expectedHTTPStatus, order, state) {
   it('put new state/skuitems to internal order with id = ' + order.id, function (done) {
        agent.put('/api/internalOrders/'+order.id).send(state)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


function deleteOrder(expectedHTTPStatus, order) {
   it('delete internal order with id = ' + order.id, function (done) {
        agent.delete('/api/internalOrders/'+ order.id)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}