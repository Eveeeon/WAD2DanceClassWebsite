const express = require("express");
const router = express.Router();
const adminConsoleController = require("../controllers/adminConsoleController");


router.get("/adminConsole", adminConsoleController.getAdminConsole);
router.post("/adminConsole/approve/:id", adminConsoleController.approveOrganiser);

module.exports = router;
