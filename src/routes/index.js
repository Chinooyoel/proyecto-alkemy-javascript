const express = require("express");
const app = express();

app.use(require("./operation"));


module.exports = app; 