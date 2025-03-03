const express = require("express");
const path = require("path");
const router = require('./routes/index');
const mustache = require('mustache-express');

const public = path.join(__dirname,'public');

const app = express();

app.use(express.static(public));
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use(express.urlencoded({extended: true }));
app.use("/", router);

module.exports = app;