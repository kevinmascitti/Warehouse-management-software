'use strict';
const express = require('express');
const app = new express();
const port = 3001;
app.use(express.json());

const database = require('./warehouse/DB.js');
const db = new database();

require('./warehouse/item')(app, db);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;