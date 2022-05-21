'use strict';
const testD = require('../warehouse/testDescriptor');
const skuI = require('../warehouse/sku');

module.exports = function (app) {

    //GET /api/testDescriptors
    app.get('/api/testDescriptors', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            const testDescriptors = await testD.getStoredTestDescriptors();
            return res.status(200).json(testDescriptors);
        }catch(err){
            return res.status(500).json();
        }
    });

    //GET /api/testDescriptors/:id
    app.get('/api/testDescriptors/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.params.id) || req.params.id < 0) {
                return res.status(422).json({error: "validation of id failed"});
            }
            const N = await testD.isThereTestDescriptor({ id: req.params.id });
            if (N == 1) {
                const testDescriptor = await testD.getStoredTestDescriptor({ id: req.params.id });
                return res.status(200).json(testDescriptor);
            }
            return res.status(404).json({error:"no testDescriptor found"});
        }catch(err){
            return res.status(500).json();
        }
        
    });

    //POST /api/testDescriptor
    app.post('/api/testDescriptor', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.body.idSKU) || req.body.idSKU < 0) {
                return res.status(422).json({error:"ivalidation of idSKU failed"});
            }
            const N = await skuI.isThereSku({id: req.body.idSKU});
            if(N == 0){
                return res.status(404).json({error: "SKU does not exist"});
            }
            const data = {
                name: req.body.name,
                procedureDescription: req.body.procedureDescription,
                idSKU: req.body.idSKU
            };
            await testD.storeTestDescriptor(data);
            return res.status(201).json();
        }catch(err){
            return res.status(503).json();
        }
        
    });

    //PUT /api/testDescriptor/:id
    app.put('/api/testDescriptor/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.params.id) || isNaN(req.body.newIdSKU) || req.params.id < 0 || req.body.newIdSKU < 0) {
                return res.status(422).json({error:"validation of id and idSKU failed"});
            }
            const data = {
                id: req.params.id,
                newName: req.body.newName,
                newProcedureDescription: req.body.newProcedureDescription,
                newIdSKU: req.body.newIdSKU
            };
            const N = await testD.isThereTestDescriptor({ id: req.params.id });
            const M = await skuI.isThereSku({ id: req.body.newIdSKU });
            if(M <= 0){
                return res.status(404).json({error:"no sku associated with idSKU"});
            }else if (N == 1) {
                await testD.modifyStoredTestDescriptor(data);
                return res.status(200).json();
            }
            return res.status(404).json({error:"no testDescriptor associated with id"});
        }catch(err){
            return res.status(503).json();
        }
    });

    //DELETE /api/testDescriptor/:id
    app.delete('/api/testDescriptor/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try{
            if (isNaN(req.params.id) || req.params.id < 0) {
                return res.status(422).json({error:"validation of id failed"});
            }
            await testD.deleteStoredTestDescriptor({ id: req.params.id });
            return res.status(204).json();
        }catch(err){
            return res.status(503).json();
        }
    });

}