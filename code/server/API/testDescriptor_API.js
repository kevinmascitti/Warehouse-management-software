'use strict';
const testD = require('../warehouse/testDescriptor');
const skuI = require('../warehouse/sku');

module.exports = function (app) {

    //GET /api/testDescriptors
    app.get('/api/testDescriptors', async (req, res) => { //MANCA 401 UNAUTHORIZED
        const testDescriptors = await testD.getStoredTestDescriptors();
        return res.status(200).json(testDescriptors);
    });

    //GET /api/testDescriptors/:id
    app.get('/api/testDescriptors/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        const N = await testD.isThereTestDescriptor({ id: req.params.id });
        if (N == 1) {
            const testDescriptor = await testD.getStoredTestDescriptor({ id: req.params.id });
            return res.status(200).json(testDescriptor);
        }
        return res.status(404).json();
    });

    //POST /api/testDescriptor
    app.post('/api/testDescriptor', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.body.idSKU)) {
            return res.status(422).json();
        }
        const N = await skuI.isThereSku({id: req.body.idSKU});
        if(N == 0){
            return res.status(422).json({error: "SKU does not exist"});
        }
        const data = {
            name: req.body.name,
            procedureDescription: req.body.procedureDescription,
            idSKU: req.body.idSKU
        };
        await testD.storeTestDescriptor(data);
        return res.status(201).json();
        //return res.status(404).json();
    });

    //PUT /api/testDescriptor/:id
    app.put('/api/testDescriptor/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id) || isNaN(req.body.newIdSKU)) {
            return res.status(422).json();
        }
        const data = {
            id: req.params.id,
            newName: req.body.newName,
            newProcedureDescription: req.body.newProcedureDescription,
            newIdSKU: req.body.newIdSKU
        };
        const N = await testD.isThereTestDescriptor({ id: req.params.id });
        if (N == 1) {
            await testD.modifyStoredTestDescriptor(data);
            return res.status(200).json();
        }
        return res.status(404).json();
    });

    //DELETE /api/testDescriptor/:id
    app.delete('/api/testDescriptor/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        if (isNaN(req.params.id)) {
            return res.status(422).json();
        }
        await testD.deleteStoredTestDescriptor({ id: req.params.id });
        return res.status(204).json();
    });

}