'use strict';
const dayjs = require('dayjs');
const resOrd = require('../warehouse/restockorder');
const sku = require('../warehouse/sku');
const skuItem = require('../warehouse/skuitem');

module.exports = function (app) {
  //POST
  app.post('/api/restockOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if ( !dayjs(req.body.issueDate).isValid() || ! Array.isArray(req.body.products) || isNaN(req.body.supplierId)) {
        return res.status(422).json(err);
      }
      //create proper ID for table insertion
      let orders = await resOrd.getOrders();
      //return res.status(200).json(orders);
      let restockOrderId = 0;
      for (let o of orders) {
        if (o.id >= restockOrderId) restockOrderId = o.id + 1; 
      }
      //INTERNALORDER insertion
      const data = {
        //id: restockOrderId,
        issueDate: req.body.issueDate,
        state: "ISSUED",
        products: req.body.products,
        supplierId: req.body.supplierId
      };
      await resOrd.storeOrder(data);
      //INTERNALORDERPRODUCT insertion
      for (let p of req.body.products) {
        await resOrd.storeOrderProduct({restockOrderId: restockOrderId, skuId: p.SKUId, quantity: p.qty});
        if ( await sku.isThereSku({id: p.SKUId}) == 0) await sku.storeSkuWithId({id: p.SKUId, description: p.description, weight: null, volume: null, notes: null, availableQuantity: p.qty, price: p.price})
      }
      return res.status(201).json();
    } catch (err) {
      if (res.statusCode != 422) res.status(500).json(err.message);
      else return res.status(422).json();
    }
  });
}