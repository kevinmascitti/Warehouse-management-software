'use strict';
const item = require('../warehouse/item');


module.exports = function (app) {

  //GET /api/items
  app.get('/api/items', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      const items = await item.getStoredItems();
      return res.status(200).json(items);
    } catch (err) {
      return res.status(500).json();
    }
  });

  //GET /api/items/:id
  app.get('/api/items/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      const N = await item.isThereItem({ id: req.params.id });
      if (N == 1) {
        const i = await item.getStoredItem({ id: req.params.id });
        return res.status(200).json(i);
      }
      return res.status(404).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //POST /api/item
  app.post('/api/item', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.body.price) 
      || isNaN(req.body.SKUId) 
      || isNaN(req.body.supplierId) 
      || isNaN(req.body.id)
      || req.body.price < 0
      || req.body.SKUId < 0
      || req.body.supplierId < 0
      || req.body.id < 0) {
        return res.status(422).json();
      }
      let N = await item.supplierAlreadySellItemWithSkuid(req.body.SKUId,req.body.supplierId);
      let M = await item.supplierAlreadySellThisItem(req.body.id,req.body.supplierId);
      if(N>0 || M>0){
        return res.status(422).json();
      }
      const data = {
        id: req.body.id,
        description: req.body.description,
        price: req.body.price,
        SKUId: req.body.SKUId,
        supplierId: req.body.supplierId
      };
      await item.storeItem(data);
      return res.status(201).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //PUT /api/item/:id
  app.put('/api/item/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id) || isNaN(req.body.newPrice)) {
        return res.status(422).json();
      }
      const data = {
        id: req.params.id,
        newDescription: req.body.newDescription,
        newPrice: req.body.newPrice,
      };
      const N = await item.isThereItem({ id: req.params.id });
      if (N == 1) {
        await item.modifyStoredItem(data);
        return res.status(200).json();
      }
      return res.status(404).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

  //DELETE /api/items/:id
  app.delete('/api/items/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await item.deleteStoredItem({ id: req.params.id });
      return res.status(204).json();
    } catch (err) {
      return res.status(500).json();
    }
  });

}