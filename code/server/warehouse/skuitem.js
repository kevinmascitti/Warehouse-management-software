'use strict';

module.exports = function (app, db) {

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

    function getStoredSkuitemsForSkuid(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT RFID,SKUID,DATEOFSTOCK FROM SKUITEM, SKU WHERE SKUITEM.SKUID=SKU.ID AND AVAILABLE=1 AND SKU.ID=?';
            db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuitems = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        DateOfStock: r.DATEOFSTOCK
                    }
                ));
                resolve(skuitems);
            });
        });
    }

    function isThereSkuitem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM SKUITEM WHERE RFID = ?';
            db.all(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    function storeSkuitem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO SKUITEM(RFID, SKUID, AVAILABLE, DATEOFSTOCK) VALUES(?, ?, ?, ?)';
            db.run(sql, [data.rfid, data.skuid, 0, data.dateofstock], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    function getStoredSkuitem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM WHERE RFID = ?';
            db.all(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuitem = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        Available: r.AVAILABLE,
                        DateOfStock: r.DATEOFSTOCK
                    }
                ));
                resolve(skuitem);
            });
        });
    }

    function getStoredSkuitems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKUITEM';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skuitems = rows.map((r) => (
                    {
                        RFID: r.RFID,
                        SKUId: r.SKUID,
                        Available: r.AVAILABLE,
                        DateOfStock: r.DATEOFSTOCK,
                    }
                ));
                resolve(skuitems);
            });
        });
    }

    function modifyStoredSkuitem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKUITEM SET RFID = ?, AVAILABLE = ?, DATEOFSTOCK = ? WHERE RFID = ?';
            db.run(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, data.oldRFID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    function deleteStoredSkuitem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SKUITEM WHERE RFID = ?';
            db.run(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }


    //GET /api/skuitems
    app.get('/api/skuitems', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            const skuitems = await getStoredSkuitems();
            return res.status(200).json(skuitems);
        } catch (err) {
            return res.status(500).json();
        }
    });

    //GET /api/skuitems/sku/:id
    app.get('/api/skuitems/sku/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)) {
                return res.status(422).json();
            }
            const N = await isThereSku({ id: req.params.id });
            if (N == 1) {
                const skuitems = await getStoredSkuitemsForSkuid({ id: req.params.id });
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
            if (isNaN(req.params.rfid)) {
                return res.status(422).json();
            }
            const N = await isThereSkuitem({ rfid: req.params.rfid });
            if (N == 1) {
                const skuitem = await getStoredSkuitem({ rfid: req.params.rfid });
                return res.status(200).json(skuitem);
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //POST /api/skuitem
    app.post('/api/skuitem', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.body.SKUId) || !req.body.RFID) {
                return res.status(422).json();
            }
            const data = {
                rfid: req.body.RFID,
                skuid: req.body.SKUId,
                dateofstock: req.body.DateOfStock,
            };
            const N = await isThereSku({ id: req.body.SKUId });
            if (N == 1) {
                await storeSkuitem(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //PUT /api/skuitems/:rfid
    app.put('/api/skuitems/:rfid', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.rfid) || (req.body.newAvailable != 0 && req.body.newAvailable != 1)) {
                return res.status(422).json();
            }
            const data = {
                oldRFID: req.params.rfid,
                newRFID: req.body.newRFID,
                newAvailable: req.body.newAvailable,
                newDateOfStock: req.body.newDateOfStock
            };
            const N = await isThereSkuitem({ rfid: req.params.rfid });
            if (N == 1) {
                await modifyStoredSkuitem(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //DELETE /api/skuitems/:rfid
    app.delete('/api/skuitems/:rfid', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.rfid)) {
                return res.status(422).json();
            }
            await deleteStoredSkuitem({ rfid: req.params.rfid });
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

}