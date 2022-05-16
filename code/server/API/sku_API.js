'use strict';
const sku = require('../warehouse/sku');

module.exports = function (app) {

    //GET /api/skus
    app.get('/api/skus', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            const skus = await sku.getStoredSkus();
            return res.status(200).json(skus);
        } catch (err) {
            return res.status(500).json();
        }
    });

    //GET /api/skus/:id
    app.get('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)) {
                return res.status(422).json();
            }
            const N = await sku.isThereSku({ id: req.params.id });
            if (N == 1) {
                const sku = await sku.getStoredSku({ id: req.params.id });
                return res.status(200).json(sku);
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //POST /api/sku
    app.post('/api/sku', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.body.weight) || isNaN(req.body.volume) || isNaN(req.body.price) || isNaN(req.body.availableQuantity)) {
                return res.status(422).json();
            }
            const data = {
                description: req.body.description,
                weight: req.body.weight,
                volume: req.body.volume,
                notes: req.body.notes,
                price: req.body.price,
                availableQuantity: req.body.availableQuantity
            };
            await sku.storeSku(data);
            return res.status(201).json();
            //return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //PUT /api/sku/:id
    app.put('/api/sku/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id) || isNaN(req.body.newPrice) || isNaN(req.body.newWeight) || isNaN(req.body.newVolume) || isNaN(req.body.newAvailableQuantity)) {
                return res.status(422).json();
            }
            const data = {
                id: req.params.id,
                newDescription: req.body.newDescription,
                newWeight: req.body.newWeight,
                newVolume: req.body.newVolume,
                newNotes: req.body.newNotes,
                newPrice: req.body.newPrice,
                newAvailableQuantity: req.body.newAvailableQuantity
            };
            const N = await sku.isThereSku({ id: req.params.id });
            if (N == 1) {
                await sku.modifyStoredSku(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //PUT /api/sku/:id/position
    app.put('/api/sku/:id/position', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id) || typeof req.body.position !== 'string' || req.body.position.length != 12) {
                return res.status(422).json();
            }
            const N = await sku.isThereSku({ id: req.params.id });
            if (N == 1) {
                const sku = await sku.getStoredSku({ id: req.params.id });
                const data = {
                    id: req.params.id,
                    newPosition: req.body.position,
                    oldPosition: sku[0].position,
                    weight: sku[0].weight,
                    volume: sku[0].volume,
                    availableQuantity: sku[0].availableQuantity
                };
                await sku.modifySkuPosition(data);
                await sku.updateNewPosition(data);
                await sku.updateOldPosition(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //DELETE /api/skus/:id
    app.delete('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)) {
                return res.status(422).json();
            }
            await sku.deleteStoredSku({ id: req.params.id });
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

}