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
                            product = await sku.getStoredSku({id: i.SKUId})
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
                items = await skuIt.getStoredSkuitemsForReturnOrder({id: o.id});
                for (let i of items) {
                    o.skuItems.push({
                        SKUId: i.SKUId,
                        rfid: i.rfid
                    })
                }
            } catch (err) {
                return res.status(500).json(err.message);
            }
        }
        return res.status(200).json(orders);
    });


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
                await resOrd.storeProduct({ restockOrderId: restockOrderId, sKUId: p.SKUId, quantity: p.qty });
                if (await sku.isThereSku({ id: p.SKUId }) == 0) await sku.storeSkuWithId({ id: p.SKUId, description: p.description, weight: null, volume: null, notes: null, availableQuantity: p.qty, price: p.price })
            }
            return res.status(201).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(500).json(err.message);
            else return res.status(422).json();
        }
    });
}