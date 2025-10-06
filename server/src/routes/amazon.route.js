const express = require("express");
const router = express.Router();
const scrapeAmazonProduct = require("../utils/scrapeAmazonProduct");

router.post("/", async (req, res) => {
  try {
    const productInfo = await scrapeAmazonProduct(req.body.amazonUrl);
    res.status(200).send(productInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
