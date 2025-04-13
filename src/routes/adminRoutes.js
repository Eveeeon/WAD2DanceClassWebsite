const express = require("express");
const router = express.Router();
const adminConsoleController = require("../controllers/adminConsoleController");

router.get("/adminConsole", adminConsoleController.getAdminConsole);

module.exports = router;
