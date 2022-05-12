'use strict';

module.exports = function (app, db) {
  //GET /api/internalOrders
  let orders, items;
  app.get('/api/internalOrders', async (req, res) => { //MANCA 401 UNAUTHORIZED
    try {
        orders = await getInternalOrders();
    } catch (err) {
        return res.status(500).json();
    }
    
    for (let o of orders) {
        let products = [];
        try {
          items = await  getProductsOrdered(o.sku);
          for (let i of items) {   
            let product;         
            try {
              product = await getItemInfoForInternalOrder (i.skuid, i.quantity);
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              products.push({
                SKUId: product.SKUId,
                description: product.description,
                price: product.price,
                RFID: i.rfid
              })
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
        orders = await getInternalOrdersIssued();
    } catch (err) {
        return res.status(500).json();
    }
    
    for (let o of orders) {
        let products = [];
        try {
          items = await  getProductsOrdered(o.sku);
          for (let i of items) {   
            let product;         
            try {
              product = await getItemInfoForInternalOrder (i.skuid, i.quantity);
            } catch (err) {
              return res.status(500).json(err.message);
            }
            if (o.state == "COMPLETED"){
              products.push({
                SKUId: product.SKUId,
                description: product.description,
                price: product.price,
                RFID: i.rfid
              })
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

  const getInternalOrders = async function () {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM INTERNALORDER';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const orders = rows.map((r) => (
            {
                sku: r.ID,
                issueDate: r.ISSUEDATE,
                state: r.STATE,
                products: [],
                customerId: r.CUSTOMERID
            }

        ))
        resolve(orders);
      });
    });
  }

  const getProductsOrdered = async function (internalOrderId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM PRODUCTORDERED WHERE INTERNALORDERID = ?';
      db.all(sql, [internalOrderId], (err, rows) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(rows.map((r) => (
          {
            skuid : r.SKUID,
            quantity : r.QUANTITY,
            rfid: r.RFID
          }
        )));
        return;
      });
    });
  }

  const getItemInfoForInternalOrder = async function (sku, quantity) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM SKU WHERE ID = ?';
      //resolve({uffa: sku, cazzo: quantity});//svasdn
      //return; //uncreachable
      db.get(sql, [sku], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(
          {
            SKUId: data.ID,
            description: data.DESCRIPTION,
            price: data.PRICE,
            quantity: quantity
          }
        )
      });
    });
  }   
}