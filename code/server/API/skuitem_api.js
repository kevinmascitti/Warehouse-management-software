'use strict';
const skuitem = require('../warehouse/skuitem');
const sku = require('../warehouse/sku');

module.exports = function (app) {

    //GET /api/skuitems
    app.get('/api/skuitems', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            const skuitems = await skuitem.getStoredSkuitems();
            return res.status(200).json(skuitems);
        } catch (err) {
            return res.status(500).json();
        }
    });

    //GET /api/skuitems/sku/:id
    app.get('/api/skuitems/sku/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)
            || req.params.id < 0) {
                return res.status(422).json();
            }
            const N = await sku.isThereSku({ id: req.params.id });
            if (N == 1) {
                const skuitems = await skuitem.getStoredSkuitemsForSkuid({ id: req.params.id });
                return res.status(200).json(skuitems);
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //GET /api/skuitems/:rfid
    app.get('/api/skuitems/:rfid', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            let regexp = new RegExp('^[0-9]+$');
            if (isNaN(req.params.rfid)
            || req.params.rfid < 0 
            || req.params.rfid.length != 32
            || regexp.test(req.params.rfid) == false) {
                return res.status(422).json();
            }
            const N = await skuitem.isThereSkuitem({ rfid: req.params.rfid });
            if (N == 1) {
                const skui = await skuitem.getStoredSkuitem({ rfid: req.params.rfid });
                return res.status(200).json(skui);
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json(err);
        }
    });

    //POST /api/skuitem
    app.post('/api/skuitem', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            let regexp = new RegExp('^[0-9]+$');
            if (isNaN(req.body.SKUId) 
            || req.body.SKUId < 0
            || isNaN(req.body.RFID)
            || req.body.RFID.length != 32 
            || req.body.RFID < 0
            || regexp.test(req.body.RFID) == false
            || (isNaN(Date.parse(req.body.DateOfStock)) && req.body.DateOfStock != null)) {
                return res.status(422).json();
            }
            const data = {
                rfid: req.body.RFID,
                skuid: req.body.SKUId,
                dateofstock: req.body.DateOfStock,
            };
            const N = await sku.isThereSku({ id: req.body.SKUId });
            if (N == 1) {
                await skuitem.storeSkuitem(data);
                return res.status(201).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(503).json();
        }
    });

    //PUT /api/skuitems/:rfid
    app.put('/api/skuitems/:rfid', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            let regexp = new RegExp('^[0-9]+$');
            if (isNaN(req.params.rfid) 
            || req.params.rfid.length != 32 
            || regexp.test(req.params.rfid) == false
            || req.params.rfid < 0
            || (req.body.newAvailable != 0 && req.body.newAvailable != 1)
            || isNaN(req.body.newRFID) 
            || req.body.newRFID.length != 32 
            || regexp.test(req.body.newRFID) == false
            || req.body.newRFID < 0
            || (isNaN(Date.parse(req.body.newDateOfStock)) && req.body.newDateOfStock != null)) {

                return res.status(422).json();
            }
            const data = {
                oldRFID: req.params.rfid,
                newRFID: req.body.newRFID,
                newAvailable: req.body.newAvailable,
                newDateOfStock: req.body.newDateOfStock
            };
            const N = await skuitem.isThereSkuitem({ rfid: req.params.rfid });
            if (N == 1) {
                await skuitem.modifyStoredSkuitem(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(503).json();
        }
    });

    //DELETE /api/skuitems/:rfid
    app.delete('/api/skuitems/:rfid', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            let regexp = new RegExp('^[0-9]+$');
            if (isNaN(req.params.rfid) 
            || req.params.rfid.length != 32
            || regexp.test(req.params.rfid) == false
            || req.params.rfid < 0) {
                return res.status(422).json();
            }
            await skuitem.deleteStoredSkuitem({ rfid: req.params.rfid });
            return res.status(204).json();
        } catch (err) {
            return res.status(503).json();
        }
    });

}