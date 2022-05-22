'use strict';
const dayjs = require('dayjs');
const resOrd = require('../warehouse/restockorder');
const itemFunctions = require('../warehouse/item');
const skuItemFunctions = require('../warehouse/skuitem');

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
                    let item;
                    try {
                        if (await itemFunctions.isThereItem({ id: i.itemId }) > 0) {
                            item = await itemFunctions.getStoredItem({ id: i.itemId })
                            if (item.supplierId != o.supplierId) continue;
                            o.products.push({
                                SKUId: item.SKUId,
                                description: item.description,
                                price: item.price,
                                qty: i.quantity
                            })
                        }
                    } catch (err) {
                        return res.status(500).json(err.message);
                    }
                }
                if (o.state == 'ISSUED' || o.state == 'DELIVERY') continue;
                items = await skuItemFunctions.getStoredSkuitemsForRestockOrder({ id: o.id });
                for (let i of items) {
                    o.skuItems.push({
                        SKUId: i.SKUId,
                        rfid: i.rfid
                    })
                }
                o.skuItems = o.skuItems.sort(function (a, b) { if (a.SKUId - b.SKUId != 0) return a.SKUId - b.SKUId; else return (a.rfid).localeCompare(b.rfid) })
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
                    let item;
                    try {
                        if (await itemFunctions.isThereItem({ id: i.itemId }) > 0) {
                            item = await itemFunctions.getStoredItem({ id: i.itemId })
                            if (item.supplierId != o.supplierId) continue;
                            o.products.push({
                                SKUId: item.SKUId,
                                description: item.description,
                                price: item.price,
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
        } catch (err) {
            return res.status(500).json(err.message);
        }
        if (order == undefined) return res.status(404).json();
        try {
            let items = await resOrd.getProducts(order.id);
            for (let i of items) {
                let item;
                try {
                    if (await itemFunctions.isThereItem({ id: i.itemId }) > 0) {
                        item = await itemFunctions.getStoredItem({ id: i.itemId })
                        if (item.supplierId != order.supplierId) continue;
                        order.products.push({
                            SKUId: item.SKUId,
                            description: item.description,
                            price: item.price,
                            qty: i.quantity
                        })
                    }
                } catch (err) {
                    return res.status(500).json(err.message);
                }
            }
            if (order.state != 'ISSUED' && order.state != 'DELIVERY') {
                items = await skuItemFunctions.getStoredSkuitemsForRestockOrder({ id: order.id });
                for (let i of items) {
                    order.skuItems.push({
                        SKUId: i.SKUId,
                        rfid: i.rfid
                    })
                }
                order.skuItems.sort(function (a, b) { if (a.SKUId - b.SKUId != 0) return a.SKUId - b.SKUId; else return (a.rfid).localeCompare(b.rfid) })
            }
        } catch (err) {
            return res.status(500).json(err.message);
        }
        return res.status(200).json(order);
    })



    app.get('/api/restockOrders/:id/returnItems', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        let order;
        let itemsToReturn = [];
        try {
            order = await resOrd.getOrderById({ id: req.params.id });
        } catch (err) {
            return res.status(500).json(err.message);
        }
        if (order == undefined) return res.status(404).json();
        if (order.state != "COMPLETEDRETURN") return res.status(422).json();
        try {
            let items = await skuItemFunctions.getItemsToReturn({ restockOrderId: order.id });
            for (let i of items) {
                itemsToReturn.push(i)
            }
            itemsToReturn.sort(function (a, b) { if (a.SKUId - b.SKUId != 0) return a.SKUId - b.SKUId; else return (a.rfid).localeCompare(b.rfid) })
        } catch (err) {
            return res.status(500).json(err.message);
        }
        return res.status(200).json(itemsToReturn);
    })



    //POST
    app.post('/api/restockOrder', async (req, res) => { //MANCA 401 UNAUTHORIZED
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
                let id = 0;
                let items = await itemFunctions.getStoredItems();
                for (let i of items) {
                    if (i.id >= id) id = i.id + 1;
                }
                await itemFunctions.storeItem({ id: id, description: p.description, price: p.price, SKUId: p.SKUId, supplierId: o.supplierId })
            }
            return res.status(201).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(500).json(err.message);
            else return res.status(422).json();
        }
    });


    //PUT
    app.put('/api/restockOrder/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState == "ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        } try {
            let order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            await resOrd.setNewState({ id: req.params.id, state: req.body.newState });
            return res.status(200).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(500).json(err.message);
            else return res.status(422).json();
        }
    });


    app.put('/api/restockOrder/:id/returnItems', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState == "ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        } try {
            let order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            console.log(req.body.skuItems)
            for (let item of req.body.skuItems) {
                console.log(item.rfid)
                if (await skuItemFunctions.isThereSkuitem({ rfid: item.rfid }) == 0) await skuItemFunctions.storeSkuitem({ rfid: item.rfid, skuid: item.SKUId, dateofstock: dayjs().format('YYYY/MM/DD HH:mm') });
                await skuItemFunctions.setRestockOrder({ rfid: item.rfid, restockOrderId: order.id });
            }
            return res.status(200).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(503).json(err.message);
            else return res.status(422).json();
        }
    });



    app.put('/api/restockOrder/:id/transportNote', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState == "ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        } try {
            let order = await resOrd.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            await resOrd.setTransportNote({ id: req.params.id, transportNote: req.body.transportNote })
            return res.status(200).json();
        } catch (err) {
            if (res.statusCode != 422) res.status(503).json(err.message);
            else return res.status(422).json();
        }
    });

    //DELETE
    app.delete('/api/restockOrder/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)) {
                return res.status(422).json();
            }
            await resOrd.deleteOrder({ id: req.params.id });
            await resOrd.deleteProducts({ id: req.params.id });
            return res.status(204).json();
        } catch (err) {
            return res.status(503).json();
        }
    });


}