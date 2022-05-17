'use strict';
const dayjs = require('dayjs');
const intord = require('../warehouse/internalorder');
const sku = require('../warehouse/sku');
const skuitem = require('../warehouse/skuitem');


module.exports = function (app) {
  //GET
  let orders, items;
  app.get('/api/internalOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await intord.getInternalOrders();
    } catch (err) {
        return res.status(500).json(err.message);
    }
    for (let o of orders) {
        let products = []
        try {
          items = await  intord.getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await intord.getSKU (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              let skuitems = await intord.getSKUItems(product.SKUId, o.id);
              for (let s of skuitems) {
                products.push({
                 SKUId: product.SKUId,
                 description: product.description,
                 price: product.price,
                 RFID: s.rfid
                })
              }
            }
            else products.push(product);

          }
        } catch (err) {
          return res.status(500).json(err.message);
        }
        o.products = products;
    }
    return res.status(200).json(orders);
  });

  app.get('/api/internalOrdersIssued', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await intord.getInternalOrdersWithState(["ISSUED"]);
    } catch (err) {
        return res.status(500).json();
    }
    for (let o of orders) {
        let products = []
        try {
          items = await  intord.getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await intord.getSKU (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              let skuitems = await intord.getSKUItems(product.SKUId, o.id);
              for (let s of skuitems) {
                products.push({
                 SKUId: product.SKUId,
                 description: product.description,
                 price: product.price,
                 RFID: s.rfid
                })
              }
            }
            else products.push(product);

          }
        } catch (err) {
          return res.status(500).json(err.message);
        }
        o.products = products;
    }
    return res.status(200).json(orders);
  });

  app.get('/api/internalOrdersAccepted', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await intord.getInternalOrdersWithState(["ACCEPTED"]);
    } catch (err) {
        return res.status(500).json();
    }
    for (let o of orders) {
        let products = []
        try {
          items = await  intord.getInternalOrderProducts(o.id);
          for (let i of items) {   
            let product;         
            try {
              product = await intord.getSKU (i.skuid, i.quantity);
              if (product == undefined) continue;
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              let skuitems = await intord.getSKUItems(product.SKUId, o.id);
              for (let s of skuitems) {
                products.push({
                 SKUId: product.SKUId,
                 description: product.description,
                 price: product.price,
                 RFID: s.rfid
                })
              }
            }
            else products.push(product);

          }
        } catch (err) {
          return res.status(500).json(err.message);
        }
        o.products = products;
    }
    return res.status(200).json(orders);
  });


  app.get('/api/internalOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    if (isNaN(req.params.id)) {
      return res.status(422).json();
    }
    try {
        orders = await intord.getInternalOrderWithID(req.params.id);
    } catch (err) {
        return res.status(503).json();
    }
    if (orders.length == 0) return res.status(404).json();

    let o = orders[0];
    try {
      items = await  intord.getInternalOrderProducts(o.id);
      for (let i of items) {   
        let product;         
        try {
          product = await intord.getSKU(i.skuid, i.quantity);
          if (product == undefined) continue;
        } catch (err) {
          return res.status(500).json(err.message);
        }
        if (o.state == "COMPLETED"){
          let skuitems = await intord.getSKUItems(product.SKUId, o.id);
          for (let s of skuitems) {
            o.products.push({
            SKUId: product.SKUId,
            description: product.description,
            price: product.price,
            RFID: s.rfid
          })
            }
        }
        else o.products.push(product);

      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
    return res.status(200).json(o);
  });

  //POST
  app.post('/api/internalOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if ( !dayjs(req.body.issueDate).isValid() || ! Array.isArray(req.body.products) || isNaN(req.body.customerId)) {
        return res.status(422).json(err);
      }
      //create proper ID for table insertion
      let orders = await intord.getInternalOrders();
      let internalOrderId = 0;
      for (let o of orders) {
        if (o.id >= internalOrderId) internalOrderId = o.id + 1; 
      }
      //INTERNALORDER insertion
      const data = {
        id: internalOrderId,
        issueDate: req.body.issueDate,
        state: "ISSUED",
        products: req.body.products,
        customerId: req.body.customerId
      };
      await intord.storeInternalOrder(data);

      //INTERNALORDERPRODUCT insertion
      for (let p of req.body.products) {
        await intord.storeInternalOrderProduct({id: internalOrderId, skuid: p.SKUId, quantity: p.qty});
        if (await sku.isThereSku(p.SKUId, 0) == undefined) await intord.storeSKU({id: p.SKUId, description: p.description, price: p.price});
      }
      return res.status(201).json();
    } catch (err) {
      if (res.statusCode != 422) res.status(500).json(err.message);
      else return res.status(422).json();
    }
  });

//PUT 
app.put('/api/internalOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
  try {
    if (isNaN(req.params.id) && !(req.body.newState == "ISSUED" || req.body.newState =="ACCEPTED" || req.body.newState == "REFUSED" || req.body.newState == "CANCELED" || (req.body.newState == "COMPETED" && Array.isArray(req.body.products)))) {
      return res.status(422).json();
    }
    const order = await intord.getInternalOrderWithID(req.params.id);
    if (order.length == 0) return res.status(404).json();

    await intord.updateStateInternalOrder(req.params.id, req.body.newState);

    if ( req.body.newState == "COMPLETED") {
      for(let product of req.body.products) {
        let item = await intord.getSKUItem(product.RFID);
        if(item == undefined) await intord.addSkuItem(product.SkuID, req.params.id, product.RFID);
      }
    }
    return res.status(200).json();
  } catch (err) {
    return res.status(503).json(err.message);
  }
});


  //DELETE
  app.delete('/api/internalOrders/:id', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
      if (isNaN(req.params.id)) {
        return res.status(422).json();
      }
      await intord.deleteInternalOrder(req.params.id);
      await intord.deleteInternalOrderProducts(req.params.id);
      await intord.deleteSkuItems(req.params.id);
      return res.status(204).json();
    } catch (err) {
      return res.status(503).json();
    }
  });   


}