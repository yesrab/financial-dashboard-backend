const express = require("express");
const router = express.Router();
const {
  test,
  getAllTransactions,
  transactionStatistics,
  getProductsPriceRange,
  itemsPerCatagory,
  getStaticsData,
} = require("../controllers/transactions");

router.route("/test").get(test);
router.route("/allTransaction").get(getAllTransactions);
router.route("/statistics").get(transactionStatistics);
router.route("/priceGraph").get(getProductsPriceRange);
router.route("/catagoryCount").get(itemsPerCatagory);
router.route("/allStatistics").get(getStaticsData);
module.exports = router;
