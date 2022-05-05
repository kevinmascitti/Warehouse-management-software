'use strict';

module.exports = function (app, db) {


  //GET /api/items
  app.get('/api/items', async (req, res) => { //MANCA 401 UNAUTHORIZED
    const items = await db.getStoredItems();
    return res.status(200).json(items);
  });

  //GET /api/items/:id
  app.get('/api/items/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    if (isNaN(req.params.id)) {
      return res.status(422).json();
    }
    const item = await db.getStoredItem({ id: req.params.id });
    if (Object.keys(item).length === 0){ //item vuoto
      return res.status(404).json();
    }
    else {
      return res.status(200).json(item);
    }
  });

  //POST /api/item
  app.post('/api/item', async (req, res) => { //MANCA 401 UNAUTHORIZED
    if (isNaN(req.body.SKUId) || isNaN(req.body.supplierId) || isNaN(req.body.id)) {
      return res.status(422).json();
    }
    const data = {
      id: req.body.id,
      description: req.body.description,
      price: req.body.price,
      SKUId: req.body.SKUId,
      supplierId: req.body.supplierId
    };
    await db.storeItem(data);
    return res.status(201).json();
    //return res.status(404).json();
  });

  //PUT /api/item/:id
  app.put('/api/item/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    if (isNaN(req.params.id) || isNaN(req.body.newPrice)) {
      return res.status(422).json();
    }
    const data = {
      id: req.params.id,
      newDescription: req.body.newDescription,
      newPrice: req.body.newPrice,
    };
    await db.modifyStoredItem(data);
    return res.status(200).json();
    //return res.status(404).json();
  });

  //DELETE /api/items/:id
  app.delete('/api/items/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    if (isNaN(req.params.id)) {
      return res.status(422).json();
    }
    await db.deleteStoredItem({ id: req.params.id });
    return res.status(204).json();
  });

}
