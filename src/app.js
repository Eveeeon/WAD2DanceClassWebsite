const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const indexRoutes = require('./routes/index');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRoutes);

module.exports = app;
