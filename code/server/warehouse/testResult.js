'use strict';

module.exports = function (app, db) {

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

    function isThereTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS N FROM TESTRESULT WHERE ID = ?';
            db.all(sql, [data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].N);
            });
        });
    }

    function getStoredTestResults(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTRESULT WHERE SKURFID = ?';
            db.all(sql, [data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testResults = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.IDTESTDESCRIPTOR,
                        Date: r.DATE,
                        Result: r.RESULT
                    }
                ));
                resolve(testResults);
            });
        });
    }

    function getStoredTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM TESTRESULT WHERE SKURFID = ? AND ID = ?';
            db.all(sql, [data.rfid, data.id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const testResult = rows.map((r) => (
                    {
                        id: r.ID,
                        idTestDescriptor: r.IDTESTDESCRIPTOR,
                        Date: r.DATE,
                        Result: r.RESULT
                    }
                ));
                resolve(testResult);
            });
        });
    }

    function storeTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO TESTRESULT(SKURFID, IDTESTDESCRIPTOR, DATE, RESULT) VALUES(?, ?, ?, ?)';
            db.run(sql, [data.rfid, data.idTestDescriptor, data.Date, data.Result], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    function modifyStoredTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE TESTRESULT SET IDTESTDESCRIPTOR = ?, DATE = ?, RESULT = ? WHERE ID = ? AND SKURFID = ?';
            db.run(sql, [data.newIdTestDescriptor, data.newDate, data.newResult, data.id, data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    function deleteStoredTestResult(data) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM TESTRESULT WHERE ID = ? AND SKURFID = ?';
            db.run(sql, [data.id, data.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    //GET /api/skuitems/:rfid/testResults
    app.get('/api/skuitems/:rfid/testResults', async (req, res) => { //MANCA 401 UNAUTHORIZED
        const N = await isThereSkuitem({ rfid: req.params.rfid });
        if (N > 0) {
            const testResults = await getStoredTestResults({ rfid: req.params.rfid });
            return res.status(200).json(testResults);
        }
        return res.status(404).json({error:"No skuitem found for provided rfid"});
    });

    //GET /api/skuitems/:rfid/testResults/:id
    app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        const N = await isThereSkuitem({ rfid: req.params.rfid });
        if (N > 0) {
            const N = await isThereTestResult({ id: req.params.id});
            if(N > 0){
                const testResults = await getStoredTestResult({ rfid: req.params.rfid, id: req.params.id });
                return res.status(200).json(testResults);
            }
            return res.status(404).json({error:"No testResult found for provided id"});
        }
        return res.status(404).json({error:"No skuitem found for provided rfid"});
    });

    //POST /api/skuitems/testResult
    app.post('/api/skuitems/testResult', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.body.idTestDescriptor)) {
            return res.status(422).json();
        }
        const N1 = await isThereSkuitem({ rfid: req.body.rfid });
        const N2 = await isThereTestDescriptor({ id: req.body.idTestDescriptor });
        if(N1 <= 0){
            return res.status(404).json({error:"No skuitem found for provided rfid"});
        }else if(N2 <= 0){
            return res.status(404).json({error:"No testDescriptor found for provided idTestDescriptor"});
        }
        const data = {
            rfid: req.body.rfid,
            idTestDescriptor: req.body.idTestDescriptor,
            Date: req.body.Date,
            Result: req.body.Result
        };
        await storeTestResult(data);
        return res.status(201).json();
    });

    //PUT /api/skuitems/:rfid/testResult/:id
    app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.body.newIdTestDescriptor)) {
            return res.status(422).json();
        }
        const N1 = await isThereSkuitem({ rfid: req.params.rfid });
        const N2 = await isThereTestDescriptor({ id: req.body.newIdTestDescriptor });
        if(N1 <= 0){
            return res.status(404).json({error:"No skuitem found for provided rfid"});
        }else if(N2 <= 0){
            return res.status(404).json({error:"No testDescriptor found for provided idTestDescriptor"});
        }
        const data = {
            id: req.params.id,
            rfid: req.params.rfid,
            newIdTestDescriptor: req.body.newIdTestDescriptor,
            newDate: req.body.newDate,
            newResult: req.body.newResult
        };
        const N = await isThereTestResult({ id: req.params.id });
        if (N == 1) {
            await modifyStoredTestResult(data);
            return res.status(200).json();
        }
        return res.status(404).json();
    });

    //DELETE /api/skuitems/:rfid/testResult/:id
    app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        await deleteStoredTestResult({ rfid: req.params.rfid, id: req.params.id });
        return res.status(204).json();
    });

}