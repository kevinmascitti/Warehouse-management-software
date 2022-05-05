'use strict';

module.exports = function (app, db) {

  // PUT /api/sku/:id/position !!!!!!!!!!!!TO BE DONE!!!!!!!!!!!!  

  function isThereSku(data) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS N FROM SKU WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows[0].N);
        });
    });
}

function storeSku(data) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, AVAILABLEQUANTITY, PRICE, TESTDESCRIPTORS) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [data.description, data.weight, data.volume, data.notes, "", data.availableQuantity, data.price, "[]"], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function getStoredSku(data) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU WHERE ID = ?';
        db.all(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const sku = rows.map((r) => (
                {
                    description: r.DESCRIPTION,
                    weight: r.WEIGHT,
                    volume: r.VOLUME,
                    notes: r.NOTES,
                    position: r.POSITION,
                    availableQuantity: r.AVAILABLEQUANTITY,
                    price: r.PRICE,
                    testDescriptors: r.TESTDESCRIPTORS
                }
            ));
            resolve(sku);
        });
    });
}

function getStoredSkus() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM SKU';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const skus = rows.map((r) => (
                {
                    id: r.ID,
                    description: r.DESCRIPTION,
                    weight: r.WEIGHT,
                    volume: r.VOLUME,
                    notes: r.NOTES,
                    position: r.POSITION,
                    availableQuantity: r.AVAILABLEQUANTITY,
                    price: r.PRICE,
                    testDescriptors: r.TESTDESCRIPTORS
                }
            ));
            resolve(skus);
        });
    });
}

function modifyStoredSku(data) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, AVAILABLEQUANTITY = ? WHERE ID = ?';
        db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function deleteStoredSku(data) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM SKU WHERE ID = ?';
        db.run(sql, [data.id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


    //GET /api/skus
    app.get('/api/skus', async (req, res) => { //MANCA 401 UNAUTHORIZED
        const skus = await getStoredSkus();
        return res.status(200).json(skus);
    });

    //GET /api/skus/:id
    app.get('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        const N = await isThereSku({ id: req.params.id });
        if (N == 1) {
            const sku = await getStoredSku({ id: req.params.id });
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
        await storeSku(data);
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
        const N = await isThereSku({ id: req.params.id });
        if (N == 1) {
            await modifyStoredSku(data);
            return res.status(200).json();
        }
        return res.status(404).json();
    });

    //DELETE /api/skus/:id
    app.delete('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        await deleteStoredSku({ id: req.params.id });
        return res.status(204).json();
    });

}