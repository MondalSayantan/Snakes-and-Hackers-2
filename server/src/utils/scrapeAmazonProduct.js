const puppeteer = require("puppeteer");

async function scrapeAmazonProduct(amazonUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],
  });
  try {
    const page = await browser.newPage();
    await page.goto(amazonUrl);
    await page.waitForSelector("body");
    const productInfo = await page.evaluate(() => {
      let title = document.body.querySelector("#productTitle").innerText;
      let price = document.body.querySelector("#price").innerText;
      let image = document.body.querySelector("#imgBlkFront").src;
      return { title, price, image };
    });
    return productInfo;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeAmazonProduct;
