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

const wrongItem = {
    id: "DOVREBBE ESSERE UN NUMERO",
    description: "another item from test API",
    price: "8.88 SONO UNA STRINGA",
    SKUId: 2,
    supplierId: 2
};

const modifyItem1 = {
    id: 1,
    newDescription: "another item from test API",
    newPrice: 2.99,
};

const modifyItem2 = {
    id: 2,
    newDescription: "another item from test API",
    newPrice: 2.99,
};

const modifyItemWrong = {
    id: 'ciao, mi presento: non sono un numero',
    newDescription: "another item from test API",
    newPrice: 2.99,
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

describe('test restockorder apis', () => {

    before(async () => {
        await item.deleteAllItems();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAll();
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
    getRestockOrders(200); //ritorna ordine
});


function getRestockOrders(expectedHTTPStatus) {
    it('get restock orders', function (done) {
        agent.get('/api/RestockOrders/')
            .then(function (r) {
                console.log(r.body)
                console.log(r.body[1].skuItems)
                //console.log([{SKUId: skuItem1.skuid, rfid: skuItem1.rfid}, {SKUId: skuItem2.skuid, rfid: skuItem2.rfid}])
                r.should.have.status(expectedHTTPStatus);
                r.body[0].id.should.equal(restockOrder1.id);
                r.body[0].state.should.equal(restockOrder1.state);
                r.body[0].products.length.should.equal(0)
                r.body[0].supplierId.should.equal(restockOrder1.supplierId);
                (r.body[0].transportNote == undefined).should.equal(true)
                r.body[0].skuItems.length.should.equal(0)
                
                r.body[1].id.should.equal(restockOrder2.id);
                r.body[1].state.should.equal(restockOrder2.state);
                r.body[1].products.length.should.equal(0)
                r.body[1].supplierId.should.equal(restockOrder2.supplierId);
                (r.body[1].transportNote == undefined).should.equal(true)
                r.body[1].skuItems[0].SKUId.should.equal(skuItem1.skuid)
                r.body[1].skuItems[0].rfid.should.equal(skuItem1.rfid)
                r.body[1].skuItems[1].SKUId.should.equal(skuItem2.skuid)
                r.body[1].skuItems[1].rfid.should.equal(skuItem2.rfid)
                done();
            });
    });
}