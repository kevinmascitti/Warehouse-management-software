'use strict';
const testR = require('../warehouse/testResult');
const testD = require('../warehouse/testDescriptor');
const skuI = require('../warehouse/skuitem');

module.exports = function (app) {

    //GET /api/skuitems/:rfid/testResults
    app.get('/api/skuitems/:rfid/testResults', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.params.rfid) || req.params.rfid < 0 || req.params.rfid.length != 32) {
                return res.status(422).json({error:"rfid not valid"});
            }
            const N = await skuI.isThereSkuitem({ rfid: req.params.rfid });
            if (N > 0) {
                const testResults = await testR.getStoredTestResults({ rfid: req.params.rfid });
                return res.status(200).json(testResults);
            }
            return res.status(404).json({error:"No skuitem found for provided rfid"});
        }catch(err){
            return res.status(500).json();
        }
    });

    //GET /api/skuitems/:rfid/testResults/:id
    app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.params.id) || req.params.id < 0) {
                return res.status(422).json({error:"validation of id failed"});
            }else if(isNaN(req.params.rfid) || req.params.rfid < 0 || req.params.rfid.length != 32){
                return res.status(422).json({error:"validation of rfid failed"});
            }
            const N = await skuI.isThereSkuitem({ rfid: req.params.rfid });
            const M = await testR.isThereTestResult({ id: req.params.id});
            if (N <= 0) {
                return res.status(404).json({error:"No skuitem found for provided rfid"});
            }else if(M <= 0){
                return res.status(404).json({error:"No testResult found for provided id"});
            }
            const testResults = await testR.getStoredTestResult({ rfid: req.params.rfid, id: req.params.id });
            return res.status(200).json(testResults);
        }catch(err){
            return res.status(500).json();
        }
    });

    //POST /api/skuitems/testResult
    app.post('/api/skuitems/testResult', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.body.idTestDescriptor) || req.body.idTestDescriptor < 0) {
                return res.status(422).json({error:"validation of idTestDescriptor failed"});
            }else if(isNaN(req.body.rfid) || req.body.rfid < 0 || req.body.rfid.length != 32){
                return res.status(422).json({error:"validation of rfid failed"});
            }else if(isNaN(Date.parse(req.body.Date))){
                return res.status(422).json({error:"validation of date failed"});
            }
            const N1 = await skuI.isThereSkuitem({ rfid: req.body.rfid });
            const N2 = await testD.isThereTestDescriptor({ id: req.body.idTestDescriptor });
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
        }catch(err){
            return res.status(503).json();
        }
        
    });

    //PUT /api/skuitems/:rfid/testResult/:id
    app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.body.newIdTestDescriptor) || req.body.newIdTestDescriptor < 0) {
                return res.status(422).json({error:"validation of idTestDescriptor failed"});
            }else if(isNaN(req.params.rfid) || req.params.rfid < 0 || req.params.rfid.length != 32){
                return res.status(422).json({error:"validation of rfid failed"});
            }else if(isNaN(req.params.id) || req.params.id < 0){
                return res.status(422).json({error:"validation of id failed"});
            }else if(isNaN(Date.parse(req.body.newDate))){
                return res.status(422).json({error:"validation of date failed"});
            }
            const N1 = await skuI.isThereSkuitem({ rfid: req.params.rfid });
            const N2 = await testD.isThereTestDescriptor({ id: req.body.newIdTestDescriptor });
            const N3 = await testR.isThereTestResult({ id: req.params.id });
            if(N1 <= 0){
                return res.status(404).json({error:"no skuitem found for provided rfid"});
            }else if(N2 <= 0){
                return res.status(404).json({error:"no testDescriptor found for provided idTestDescriptor"});
            }else if(N3 <= 0){
                return res.status(404).json({error:"no testResult found for provided id"});
            }
            const data = {
                id: req.params.id,
                rfid: req.params.rfid,
                newIdTestDescriptor: req.body.newIdTestDescriptor,
                newDate: req.body.newDate,
                newResult: req.body.newResult
            };
            await testR.modifyStoredTestResult(data);
            return res.status(200).json();
        }catch(err){
            return res.status(503).json();
        }
        
    });

    //DELETE /api/skuitems/:rfid/testResult/:id
    app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if(isNaN(req.params.rfid) || req.params.rfid < 0 || req.params.rfid.length != 32){
                return res.status(422).json({error:"validation of rfid failed"});
            }else if(isNaN(req.params.id) || req.params.id < 0){
                return res.status(422).json({error:"validation of id failed"});
            }
            await testR.deleteStoredTestResult({ rfid: req.params.rfid, id: req.params.id });
            return res.status(204).json();
        }catch(err){
            return res.status(503).json();
        }
       
    });

}