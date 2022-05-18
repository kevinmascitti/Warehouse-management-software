'use strict';
const express = require('express');
const app = new express();
const port = 3001;
app.use(express.json());

require('./API/item_API')(app);
require('./API/sku_API')(app);
require('./API/skuitem_api')(app);
require('./API/internalOrder_API')(app);
require('./API/restockOrder_API')(app);
require('./API/position_API')(app);
require('./API/user_API')(app);
require('./API/testDescriptor_API')(app);
require('./API/testResult_API')(app);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;