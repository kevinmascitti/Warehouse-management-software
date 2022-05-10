'use strict';

module.exports = function (app, db) {

    function getStoredTestDescriptors() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTDESCRIPTOR';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testDescriptors = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDUREDESCRIPTION,
                        idSKU: r.IDSKU
                    }
                ));
                resolve(testDescriptors);
            });
        });
    }

    function getStoredTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTDESCRIPTOR WHERE ID = ?';
            db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testDescriptor = rows.map((r) => (
                    {
                        id: r.ID,
                        name: r.NAME,
                        procedureDescription: r.PROCEDUREDESCRIPTION,
                        idSKU: r.IDSKU
                    }
                ));
                resolve(testDescriptor);
            });
        });
    }

    function isThereTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM TESTDESCRIPTOR WHERE ID = ?';
            db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    function storeTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TESTDESCRIPTOR(NAME, PROCEDUREDESCRIPTION, IDSKU) VALUES(?, ?, ?)';
            db.run(sql, [data.name, data.procedureDescription, data.idSKU], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    function modifyStoredTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TESTDESCRIPTOR SET NAME = ?, PROCEDUREDESCRIPTION = ?, IDSKU = ? WHERE ID = ?';
            db.run(sql, [data.newName, data.newProcedureDescription, data.newIdSKU, data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    function deleteStoredTestDescriptor(data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTDESCRIPTOR WHERE ID = ?';
            db.run(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //GET /api/testDescriptors
    app.get('/api/testDescriptors', async (req, res) => { //MANCA 401 UNAUTHORIZED
        const testDescriptors = await getStoredTestDescriptors();
        return res.status(200).json(testDescriptors);
    });

    //GET /api/testDescriptors/:id
    app.get('/api/testDescriptors/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        const N = await isThereTestDescriptor({ id: req.params.id });
        if (N == 1) {
            const testDescriptor = await getStoredTestDescriptor({ id: req.params.id });
            return res.status(200).json(testDescriptor);
        }
        
        return res.status(404).json();
    });

    //POST /api/testDescriptors
    app.post('/api/testDescriptors', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.body.idSKU)) {
            return res.status(422).json();
        }
        const data = {
            name: req.body.name,
            procedureDescription: req.body.procedureDescription,
            idSKU: req.body.idSKU
        };
        await storeTestDescriptor(data);
        return res.status(201).json();
        //return res.status(404).json();
    });

    //PUT /api/testDescriptors/:id
    app.put('/api/testDescriptors/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) || isNaN(req.body.newIdSKU)) {
            return res.status(422).json();
        }
        const data = {
            id: req.params.id,
            newName: req.body.newName,
            newProcedureDescription: req.body.newProcedureDescription,
            newIdSKU: req.body.newIdSKU
        };
        const N = await isThereTestDescriptor({ id: req.params.id });
        if (N == 1) {
            await modifyStoredTestDescriptor(data);
            return res.status(200).json();
        }
        return res.status(404).json();
    });

    //DELETE /api/testDescriptors/:id
    app.delete('/api/testDescriptors/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        await deleteStoredTestDescriptor({ id: req.params.id });
        return res.status(204).json();
    });

}