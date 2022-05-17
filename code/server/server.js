'use strict';
const express = require('express');
const app = new express();
const port = 3001;
app.use(express.json());

<<<<<<< HEAD
const database = require('./warehouse/DB.js');
const DB = new database();

require('./warehouse/item')(app, DB.db);
require('./warehouse/sku')(app, DB.db);
require('./warehouse/skuitem')(app, DB.db);
require('./warehouse/internalorder')(app, DB.db);
require('./warehouse/restockorder')(app, DB.db);
require('./warehouse/position')(app, DB.db);
require('./warehouse/user')(app, DB.db);
require('./warehouse/testDescriptor')(app, DB.db);
require('./warehouse/testResult')(app, DB.db);
=======
require('./API/item_API')(app);
require('./API/sku_API')(app);
require('./API/skuitem_api')(app);
require('./API/internalOrder_API')(app);
require('./API/position_API')(app);
require('./API/user_API')(app);
require('./API/testDescriptor_API')(app);
require('./API/testResult_API')(app);
>>>>>>> d5be92e57ac3fe87af56e6ad777bd8c35741bcd3

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
