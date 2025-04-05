// app.js
const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const indexRoutes = require("./routes/index");

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Templating engine setup
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);

module.exports = app;
