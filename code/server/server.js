'use strict';
const express = require('express');
const app = new express();
const port = 3001;
app.use(express.json());

const database = require('./warehouse/DB.js');
const DB = new database();

require('./warehouse/item')(app, DB.db);
require('./warehouse/sku')(app, DB.db);
require('./warehouse/skuitem')(app, DB.db);
require('./warehouse/position')(app, DB.db);
require('./warehouse/testDescriptor')(app, DB.db);
require('./warehouse/testResult')(app, DB.db);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;