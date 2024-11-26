const express = require("express");
const { calculateProfit } = require("../controllers/profitController");


const router = express.Router();

router.post("/", calculateProfit);

module.exports = router;
