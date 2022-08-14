const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {
  puppeteer
    .launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
      ],
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(req.body.amazonUrl);
      await page.waitForSelector("body");

      var productInfo = await page.evaluate(() => {
        /* Get product title */
        let title = document.body.querySelector("#productTitle").innerText;
        /* Get product price */
        let price = document.body.querySelector("#price").innerText;
        let image = document.body.querySelector("#imgBlkFront").src;
        var productInfo = {
          title: title,
          price: price,
          image: image,
        };
        return productInfo;
      });

      res.status(200).send(productInfo);
      await browser.close();
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send(error);
    });

  //   res.send("Hello World");
});

module.exports = router;
