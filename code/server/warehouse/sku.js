'use strict';

module.exports = function (app, db) {

  // PUT /api/sku/:id/position !!!!!!!!!!!!TO BE DONE!!!!!!!!!!!!  


    //GET /api/skus
    app.get('/api/skus', async (req, res) => { //MANCA 401 UNAUTHORIZED
        const skus = await db.getStoredSkus();
        return res.status(200).json(skus);
    });

    //GET /api/skus/:id
    app.get('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        const N = await db.isThereSku({ id: req.params.id });
        if (N == 1) {
            const sku = await db.getStoredSku({ id: req.params.id });
            return res.status(200).json(sku);
        }
        return res.status(404).json();
    });

    //POST /api/sku
    app.post('/api/sku', async (req, res) => { //MANCA 401 UNAUTHORIZED
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
        await db.storeSku(data);
        return res.status(201).json();
        //return res.status(404).json();
    });

    //PUT /api/sku/:id
    app.put('/api/sku/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
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
        const N = await db.isThereSku({ id: req.params.id });
        if (N == 1) {
            await db.modifyStoredSku(data);
            return res.status(200).json();
        }
        return res.status(404).json();
    });

    //DELETE /api/skus/:id
    app.delete('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        await db.deleteStoredSku({ id: req.params.id });
        return res.status(204).json();
    });

}