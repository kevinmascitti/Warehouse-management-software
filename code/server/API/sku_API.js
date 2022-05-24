'use strict';
const sku = require('../warehouse/sku');
const positionFunctions = require('../warehouse/position');

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
            if (isNaN(req.params.id)
            || req.params.id < 0) {
                return res.status(422).json();
            }
            const N = await sku.isThereSku({ id: req.params.id });
            if (N == 1) {
                const sk = await sku.getStoredSku({ id: req.params.id });
                return res.status(200).json(sk);
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(500).json();
        }
    });

    //POST /api/sku
    app.post('/api/sku', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.body.weight) 
            || isNaN(req.body.volume) 
            || isNaN(req.body.price) 
            || isNaN(req.body.availableQuantity)
            || req.body.weight < 0
            || req.body.volume < 0
            || req.body.price < 0
            || req.body.availableQuantity < 0) {
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
        } catch (err) {
            return res.status(503).json();
        }
    });

    //PUT /api/sku/:id
    app.put('/api/sku/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id) 
            || isNaN(req.body.newPrice) 
            || isNaN(req.body.newWeight) 
            || isNaN(req.body.newVolume) 
            || isNaN(req.body.newAvailableQuantity)
            || req.params.id < 0
            || req.body.newPrice < 0
            || req.body.newWeight < 0
            || req.body.newVolume < 0
            || req.body.newAvailableQuantity < 0) {
                return res.status(422).json();
            }
            const data = {
                id: req.params.id,
                newDescription: req.body.newDescription,
                newWeight: req.body.newWeight,
                newVolume: req.body.newVolume,
                newNotes: req.body.newNotes,
                newPrice: req.body.newPrice,
                newAvailableQuantity: req.body.newAvailableQuantity,
                newTestDescriptors: req.body.newTestDescriptors ? req.body.newTestDescriptors : false
            };
            const N = await sku.isThereSku({ id: req.params.id });
            if (N == 1) {
                let skuPosition = await sku.getSkuPosition(req.params.id);
                if(skuPosition && skuPosition.id.length == 12) {
                    const sk = await sku.getStoredSku({ id: req.params.id });
                    let oldAvailableQuantity = sk.availableQuantity;
                    let oldVolume = sk.volume;
                    let oldWeight = sk.weight;
                    let diffVolume = req.body.newVolume - oldVolume;
                    let diffWeight = req.body.newWeight - oldWeight;
                    if (diffVolume > skuPosition.maxVolume - skuPosition.occupiedVolume
                        || diffWeight > skuPosition.maxWeight - skuPosition.occupiedWeight){
                            return res.status(422).json(); //posizione non ha capienza sufficiente!!!!!!
                        }
                        const subtractOldOccupacy = {
                            oldPosition: skuPosition.id,
                            weight: oldWeight,
                            volume: oldVolume,
                            availableQuantity: oldAvailableQuantity
                        };
                        const addNewOccupacy = {
                            newPosition: skuPosition.id,
                            weight: req.body.newWeight,
                            volume: req.body.newVolume,
                            availableQuantity: req.body.newAvailableQuantity
                        };
                        await sku.modifyStoredSku(data);
                        await sku.updateOldPosition(subtractOldOccupacy);
                        await sku.updateNewPosition(addNewOccupacy);
                        return res.status(200).json();
                    }
                await sku.modifyStoredSku(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(503).json();
        }
    });

    //PUT /api/sku/:id/position
    app.put('/api/sku/:id/position', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)
            || req.params.id < 0
            || !req.body.position.match("^[0-9]*$")
            || req.body.position.length!=12) {
                return res.status(422).json();
            }
            const N = await sku.isThereSku({ id: req.params.id });
            const M = await positionFunctions.isTherePosition({ id: req.body.position });
            if (N == 1 && M == 1) {
                let posAlreadyAssigned = await sku.isPositionAlreadyAssignedToOtherSku(req.params.id, req.body.position);
                if(posAlreadyAssigned) {
                    return res.status(422).json();
                }
                
                let positionObject = await sku.getPositionInfos(req.body.position);
                const sk = await sku.getStoredSku({ id: req.params.id });
                if(sk.position == req.body.position){
                    return res.status(200).json(); //posizione rimane uguale!!!
                }
                if(sk.volume > positionObject.maxVolume - positionObject.occupiedVolume
                    || sk.weight > positionObject.maxWeight - positionObject.occupiedWeight){
                        return res.status(422).json();
                    }
                const data = {
                    id: req.params.id,
                    newPosition: req.body.position,
                    oldPosition: sk.position,
                    weight: sk.weight,
                    volume: sk.volume,
                    availableQuantity: sk.availableQuantity
                };
                await sku.modifySkuPosition(data);
                await sku.updateOldPosition(data);
                await sku.updateNewPosition(data);
                return res.status(200).json();
            }
            return res.status(404).json();
        } catch (err) {
            return res.status(503).json();
        }
    });

    //DELETE /api/skus/:id
    app.delete('/api/skus/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
        try {
            if (isNaN(req.params.id)
            || req.params.id < 0) {
                return res.status(422).json();
            }
            await sku.deleteStoredSku({ id: req.params.id });
            return res.status(204).json();
        } catch (err) {
            return res.status(503).json();
        }
    });

}