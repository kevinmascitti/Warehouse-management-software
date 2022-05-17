'use strict';
const testR = require('../warehouse/testResult');

module.exports = function (app) {

    //GET /api/skuitems/:rfid/testResults
    app.get('/api/skuitems/:rfid/testResults', async (req, res) => { //MANCA 401 UNAUTHORIZED
        const N = await testR.isThereSkuitem({ rfid: req.params.rfid });
        if (N > 0) {
            const testResults = await testR.getStoredTestResults({ rfid: req.params.rfid });
            return res.status(200).json(testResults);
        }
        return res.status(404).json({error:"No skuitem found for provided rfid"});
    });

    //GET /api/skuitems/:rfid/testResults/:id
    app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        const N = await testR.isThereSkuitem({ rfid: req.params.rfid });
        if (N > 0) {
            const N = await testR.isThereTestResult({ id: req.params.id});
            if(N > 0){
                const testResults = await testR.getStoredTestResult({ rfid: req.params.rfid, id: req.params.id });
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
        const N1 = await testR.isThereSkuitem({ rfid: req.body.rfid });
        const N2 = await testR.isThereTestDescriptor({ id: req.body.idTestDescriptor });
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
        await testR.storeTestResult(data);
        return res.status(201).json();
    });

    //PUT /api/skuitems/:rfid/testResult/:id
    app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.body.newIdTestDescriptor)) {
            return res.status(422).json();
        }
        const N1 = await testR.isThereSkuitem({ rfid: req.params.rfid });
        const N2 = await testR.isThereTestDescriptor({ id: req.body.newIdTestDescriptor });
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
        const N = await testR.isThereTestResult({ id: req.params.id });
        if (N == 1) {
            await testR.modifyStoredTestResult(data);
            return res.status(200).json();
        }
        return res.status(404).json();
    });

    //DELETE /api/skuitems/:rfid/testResult/:id
    app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        await testR.deleteStoredTestResult({ rfid: req.params.rfid, id: req.params.id });
        return res.status(204).json();
    });

}