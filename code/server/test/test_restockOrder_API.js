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

const skuItem2 = {
    skuid:180,
    rfid:"12345678901234567890123456789017",
    dateofstock: dayjs().format("YYYY/MM/DD HH:mm")
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

describe('test restockorder apis', () => {

    before(async () => {
        await item.deleteAllItems();
        await skuItem.deleteAllSkuitems();
        await restockOrder.deleteAll();

        await item.storeItem(item1);
        await item.storeItem(item2);
        await skuItem.storeSkuitem(skuItem1);
        await skuItem.storeSkuitem(skuItem2);
        await restockOrder.storeOrder(restockOrder1);
    });
    getRestockOrders(200); //ritorna ordine
    /*
    getNonExistingItem(404, item1); //item1 non esiste ancora nel DB
    storeItem(201, item1); //item1 inserito
    getItem(200, item1); //ritornato correttamente
    storeItem(201, item2); //item2 inserito
    storeItem(422, item2); //DUPLICATO ==> STESSO ITEM GIA VENDUTO DA STESSO SUPPLIER (ERROR 422) 
    storeItem(422, wrongItem); //FORMATO SBAGLIATO ==> ERRORE 
    getMultipleItems(200, [item1, item2]); //item1 e item2 ritornati
    modifyItemAndCheck(200, modifyItem1); //modifico item1 e controllo modifiche
    deleteItem(204, item2); //elimino item1
    getNonExistingItem(404, item2); //controllo che sia stato eliminato
    modifyItem(404, modifyItem2); //item2 non esiste piu
    modifyItem(422, modifyItemWrong); //FORMATO SBAGLIATO ==> ERRORE 
    */
});


function getRestockOrders(expectedHTTPStatus) {
    it('get restock orders', function (done) {
        agent.get('/api/RestockOrders/')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body[0].id.should.equal(restockOrder1.id);
                r.body[0].state.should.equal(restockOrder1.state);
                r.body[0].products.should.length == 0
                r.body[0].supplierId.should.equal(restockOrder1.supplierId);
                r.body[0].transportNote == null
                r.body[0].skuItems.should.length == 0
                done();
            });
    });
}