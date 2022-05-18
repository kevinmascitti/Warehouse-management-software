'use strict';
const dayjs = require('dayjs');
const resOrd = require('../warehouse/restockorder');
const sku = require('../warehouse/sku');
const skuIt = require('../warehouse/skuitem');

module.exports = function (app) {
    //GET
    app.get('/api/restockOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
        let orders;
        try {
            orders = await resOrd.getOrders();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        for (let o of orders) {
            try {
                let items = await resOrd.getProducts(o.id);
                for (let i of items) {
                    let product;
                    try {
                        if (await sku.isThereSku({ id: i.SKUId }) == 1) {
                            product = await sku.getStoredSku({ id: i.SKUId })
                            product = product[0]
                            o.products.push({
                                SKUId: i.SKUId,
                                description: product.description,
                                price: product.price,
                                qty: i.quantity
                            })
                        }
                    } catch (err) {
                        return res.status(500).json(err.message);
                    }
                }
                if (o.state == 'ISSUED' || o.state == 'DELIVERY') continue;
                items = await skuIt.getStoredSkuitemsForReturnOrder({ id: o.id });
                for (let i of items) {
                    o.skuItems.push({
                        SKUId: i.SKUId,
                        rfid: i.RFID
                    })
                }
            } catch (err) {
                return res.status(500).json(err.message);
            }
        }
        return res.status(200).json(orders);
    });


    app.get('/api/restockOrdersIssued', async (req, res) => { //MANCA 401 UNAUTHORIZED
        let orders;
        try {
            orders = await resOrd.getOrdersIssued();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        for (let o of orders) {
            try {
                let items = await resOrd.getProducts(o.id);
                for (let i of items) {
                    let product;
                    try {
                        if (await sku.isThereSku({ id: i.SKUId }) == 1) {
                            product = await sku.getStoredSku({ id: i.SKUId })
                            product = product[0]
                            o.products.push({
                                SKUId: i.SKUId,
                                description: product.description,
                                price: product.price,
                                qty: i.quantity
                            })
                        }
                    } catch (err) {
                        return res.status(500).json(err.message);
                    }
                }
            } catch (err) {
                return res.status(500).json(err.message);
            }
        }
        return res.status(200).json(orders);
    });


    app.get('/api/restockOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        let order;
        try {
            order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        try {
            let items = await resOrd.getProducts(order.id);
            for (let i of items) {
                let product;
                try {
                    if (await sku.isThereSku({ id: i.SKUId }) == 1) {
                        product = await sku.getStoredSku({ id: i.SKUId })
                        product = product[0]
                        order.products.push({
                            SKUId: i.SKUId,
                            description: product.description,
                            price: product.price,
                            qty: i.quantity
                        })
                    }
                } catch (err) {
                    return res.status(500).json(err.message);
                }
            }
            if (order.state != 'ISSUED' || order.state != 'DELIVERY') {
                items = await skuIt.getStoredSkuitemsForReturnOrder({ id: order.id });
                for (let i of items) {
                    order.skuItems.push({
                        SKUId: i.SKUId,
                        rfid: i.RFID
                    })
                }
            }
        } catch (err) {
            return res.status(500).json(err.message);
        }
        return res.status(200).json(order);
    })



    //POST
    app.post('/api/restockOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (!dayjs(req.body.issueDate).isValid() || !Array.isArray(req.body.products) || isNaN(req.body.supplierId)) {
                return res.status(422).json(err);
            }
            //create proper ID for table insertion
            let orders = await resOrd.getOrders();
            let restockOrderId = 0;
            for (let o of orders) {
                if (o.id >= restockOrderId) restockOrderId = o.id + 1;
            }
            //RESTOCKORDER insertion
            const data = {
                id: restockOrderId,
                issueDate: req.body.issueDate,
                state: "ISSUED",
                products: req.body.products,
                supplierId: req.body.supplierId
            };
            await resOrd.storeOrder(data);
            //PRODUCT + SKU insertion
            for (let p of req.body.products) {
                await resOrd.storeProduct({ restockOrderId: restockOrderId, SKUId: p.SKUId, quantity: p.qty });
                if (await sku.isThereSku({ id: p.SKUId }) == 0) await sku.storeSkuWithId({ id: p.SKUId, description: p.description, weight: null, volume: null, notes: null, availableQuantity: p.qty, price: p.price })
            }
            return res.status(201).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(500).json(err.message);
            else return res.status(422).json();
        }
    });


    //PUT
    app.put('/api/restockOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState =="ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        }try {
            let order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            await resOrd.setNewState({id: req.params.id, state: req.body.newState});
            return res.status(200).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(500).json(err.message);
            else return res.status(422).json();
        }
    });


    app.put('/api/restockOrders/:id/skuItems', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState =="ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        }try {
            let order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            for (let item of req.body.skuItems) {
                if (await skuIt.isThereSkuitem() == 0) await skuIt.storeSkuitem({rfid: item.rfid, skuid: item.skuid, dateofstock: dayjs().format('YYYY/MM/DD HH:mm')});
                await skuIt.setRestockOrder({rfid: item.rfid, restockOrderId: order.id});
            }
            return res.status(200).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(503).json(err.message);
            else return res.status(422).json();
        }
    });



    app.put('/api/restockOrders/:id/transportNote', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState =="ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        }try {
            let order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            await resOrd.setTransportNote({id: req.params.id, transportNote: req.body.transportNote})
            return res.status(200).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(503).json(err.message);
            else return res.status(422).json();
        }
    });

    //DELETE
  app.delete('/api/restockOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await resOrd.deleteOrder({id: req.params.id});
      await resOrd.deleteProducts({id: req.params.id});
      return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });   


}