const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const indexRoutes = require("./routes/index");
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

dotenv.config();

const app = express();

// Security & middleware libraries
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, "public")));

// Mustache
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", indexRoutes);

module.exports = app;
