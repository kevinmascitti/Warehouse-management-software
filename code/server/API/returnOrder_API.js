'use strict';
const dayjs = require('dayjs');
const returnOrderFunctions = require('../warehouse/returnorder');
const skuFunctions = require('../warehouse/sku');
const skuItemFunctions = require('../warehouse/skuitem');

module.exports = function (app) {
    //GET
    app.get('/api/returnOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
        let orders;
        try {
            orders = await returnOrderFunctions.getOrders();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        for (let o of orders) {
            try {
                let items = await skuItemFunctions.getStoredSkuitemsForReturnOrder({ id: o.restockOrderId })
                for (let i of items) {
                    if (i.return == 1 && await skuFunctions.isThereSku({ id: i.SKUId }) == 1) {
                        let sku = await skuFunctions.getStoredSku({ id: i.SKUId })
                        o.products.push({ SKUId: i.SKUId, description: sku[0].description, price: sku[0].price, rfid: i.RFID });
                    }
                }
            } catch (err) {
                return res.status(500).json(err.message);
            }
        }
        return res.status(200).json(orders);
    });


    app.get('/api/returnOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        let order;
        try {
            order = await returnOrderFunctions.getOrderById({ id: req.params.id });
            console.log(order)
            if (order == undefined) return res.status(404).json();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        try {
            let items = await skuItemFunctions.getStoredSkuitemsForReturnOrder({ id: order.restockOrderId })
            console.log(items)
            for (let i of items) {
                if (i.return == 1 && await skuFunctions.isThereSku({ id: i.SKUId }) == 1) {
                    let sku = await skuFunctions.getStoredSku({ id: i.SKUId })
                    order.products.push({ SKUId: i.SKUId, description: sku[0].description, price: sku[0].price, rfid: i.RFID });
                }
            }
        } catch (err) {
            return res.status(500).json(err.message);
        }
        return res.status(200).json(order);
    });



    app.post('/api/returnOrder', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (!dayjs(req.body.returnDate).isValid() || !Array.isArray(req.body.products) || isNaN(req.body.restockOrderId)) {
                return res.status(422).json(err);
            }
            //create proper ID for table insertion
            let orders = await returnOrderFunctions.getOrders();
            let restockOrderId = 0;
            for (let o of orders) {
                if (o.id >= restockOrderId) restockOrderId = o.id + 1;
            }
            //RETURNORDER insertion
            const data = {
                id: restockOrderId,
                returnDate: req.body.returnDate,
                restockOrderId: req.body.restockOrderId
            };
            await returnOrderFunctions.storeOrder(data);
            //PRODUCT + SKU insertion
            for (let p of req.body.products) {
                console.log
                if (await skuFunctions.isThereSku({ id: p.SKUId }) == 0) await skuFunctions.storeSkuWithId({ id: p.SKUId, description: p.description, weight: null, volume: null, notes: null, availableQuantity: null, price: p.price })
                if (await skuItemFunctions.isThereSkuitem({ rfid: p.RFID }) == 0) await skuItemFunctions.storeSkuitem({ rfid: p.RFID, skuid: p.SKUId, dateofstock: dayjs().format('YYYY/MM/DD HH:mm') })
                await skuItemFunctions.setReturn({rfid: p.RFID, restockOrderId: restockOrderId, return: 1})
            }
            return res.status(201).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(500).json(err.message);
            else return res.status(422).json();
        }
    });

 //DELETE
 app.delete('/api/returnOrder/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await returnOrderFunctions.deleteOrder({id: req.params.id});
      return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });   


}