'use strict';
const dayjs = require('dayjs');
const restockOrderFunctions = require('../warehouse/restockorder');
const itemFunctions = require('../warehouse/item');
const skuItemFunctions = require('../warehouse/skuitem');

module.exports = function (app) {
    //GET
    app.get('/api/restockOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
        let orders;
        try {
            orders = await restockOrderFunctions.getOrders();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        for (let o of orders) {
            try {
                let items = await restockOrderFunctions.getProducts(o.id);
                for (let i of items) {
                    let item;
                    try {
                        if (await itemFunctions.isThereItem({ id: i.itemId, supplierId:  o.supplierId }) > 0) {
                            item = await itemFunctions.getStoredItem({ id: i.itemId})
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
                o.products.sort(function (a, b) {return a.SKUId - b.SKUId})
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
            orders = await restockOrderFunctions.getOrdersIssued();
        } catch (err) {
            return res.status(500).json(err.message);
        }
        for (let o of orders) {
            try {
                let items = await restockOrderFunctions.getProducts(o.id);
                for (let i of items) {
                    try {
                        if (await itemFunctions.isThereItem({ id: i.itemId, supplierId:  o.supplierId }) > 0) {
                            let item = await itemFunctions.getStoredItem({ id: i.itemId})
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
                o.products.sort(function (a, b) {return a.SKUId - b.SKUId})
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
            order = await restockOrderFunctions.getOrderById({ id: req.params.id });
        } catch (err) {
            return res.status(500).json(err.message);
        }
        if (order == undefined) return res.status(404).json();
        try {
            let items = await restockOrderFunctions.getProducts(order.id);
            for (let i of items) {
                try {
                    if (await itemFunctions.isThereItem({ id: i.itemId, supplierId:  order.supplierId }) > 0) {
                        let item = await itemFunctions.getStoredItem({ id: i.itemId})
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
            order.products.sort(function (a, b) {return a.SKUId - b.SKUId})
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
            order = await restockOrderFunctions.getOrderById({ id: req.params.id });
        } catch (err) {
            return res.status(500).json(err.message);
        }
        if (order == undefined) return res.status(404).json();
        if (order.state != "COMPLETEDRETURN") return res.status(422).json();
        try {
            let items = await skuItemFunctions.getItemsToReturn({ restockOrderId: order.id });
            for (let i of items) {
                if(i.restockOrderId = req.params.id) itemsToReturn.push(i)
            }
            itemsToReturn.sort(function (a, b) { if (a.SKUId - b.SKUId != 0) return a.SKUId - b.SKUId; else return (a.rfid).localeCompare(b.rfid) })
            return res.status(200).json(itemsToReturn);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    })



    //POST
    app.post('/api/restockOrder', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (!dayjs(req.body.issueDate).isValid() || !Array.isArray(req.body.products) || isNaN(req.body.supplierId)) {
                return res.status(422).json(err);
            }
            //create proper ID for table insertion
            let orders = await restockOrderFunctions.getOrders();
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
            await restockOrderFunctions.storeOrder(data);
            //PRODUCT insertion
            for (let p of req.body.products) {
                let allItems = await itemFunctions.getStoredItems()
                let items=allItems.filter((i) => {return i.SKUId == p.SKUId && i.supplierId == req.body.supplierId})
                if(items.length == 0) throw new Error("no item exixsts with the provided sku=(" + p.SKUId + "), supplierid=(" + req.body.supplierId + ")")
                if(items.length > 1) throw new Error("Integrity constraint violated on table ITEM: more than one item exists with sku=(" + p.SKUId + "), supplierid=(" + req.body.supplierId + ")")
                await restockOrderFunctions.storeProduct({restockOrderId: restockOrderId, itemId: items[0].id, quantity: p.qty})
            }
            return res.status(201).json();
        } catch (err) {
            return res.status(503).json(err.message);
        }
    });


    //PUT
    app.put('/api/restockOrder/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) || !(req.body.newState == "ISSUED" || req.body.newState == "DELIVERY" || req.body.newState == "DELIVERED" || req.body.newState == "TESTED" || req.body.newState == "COMPLETEDRETURN" || req.body.newState == "COMPETED")) {
            return res.status(422).json();
        } try {
            let order = await restockOrderFunctions.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            await restockOrderFunctions.setNewState({ id: req.params.id, state: req.body.newState });
            return res.status(200).json();
        } catch (err) {
            res.status(503).json(err.message);
        }
    });


    app.put('/api/restockOrder/:id/skuItems', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) || !Array.isArray(req.body.skuItems) || req.body.skuItems.length <1) {
            return res.status(422).json();
        } try {
            let order = await restockOrderFunctions.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            for (let item of req.body.skuItems) {
                if (await skuItemFunctions.isThereSkuitem({ rfid: item.rfid }) == 0) throw new Error("No skuItem is present in SKUITEM with rfid = " + item.rfid)
                await skuItemFunctions.setRestockOrder({ rfid: item.rfid, restockOrderId: order.id });
            }
            return res.status(200).json();
        } catch (err) {
            res.status(503).json(err.message);
        }
    });



    app.put('/api/restockOrder/:id/transportNote', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) || req.body.transportNote == undefined || !dayjs().isValid(req.body.transportNote.deliveryDate)) {
            return res.status(422).json();
        } try {
            let order = await restockOrderFunctions.getOrderById({ id: req.params.id });
            if (order == undefined) return res.status(404).json();
            const date = dayjs(order.issueDate);
            if (date.diff(req.body.transportNote.deliveryDate, 'day') > 0 )  return res.status(422).json();
            if (order.state != "DELIVERY" )  return res.status(422).json();
            await restockOrderFunctions.setTransportNote({ id: req.params.id, transportNote: req.body.transportNote.deliveryDate})
            return res.status(200).json();
        } catch (err) {
            return res.status(503).json(err.message);
        }
    });

    //DELETE
    app.delete('/api/restockOrder/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)) {
                return res.status(422).json();
            }
            await restockOrderFunctions.deleteOrder({ id: req.params.id });
            await restockOrderFunctions.deleteProducts({ id: req.params.id });
            return res.status(204).json();
        } catch (err) {
            return res.status(503).json();
        }
    });


}