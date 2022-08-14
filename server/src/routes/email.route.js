const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const config = require("../config");

sgMail.setApiKey(config.sendgrid.apiKey);

router.post("/", async (req, res) => {
  const msg = {
    to: req.body.toEmail,
    from: "snakesandhackers2@sayantanmondal.com",
    subject: `You owe a gift to ${req.body.fromName}`,
    text: "Greetings, Please the below Amazon link to buy the gift for ${req.body.fromName}. ${req.body.amazonUrl}. Thanks for Playing!",
    html: `<h4>Greeetings,<h4> 
           <p>Please use the below Amazon link to buy the gift for ${req.body.fromName}</p>  
           <a href="${req.body.amazonUrl}">${req.body.amazonUrl}</a>
           <p>Thanks for Playing!</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send("Email sent");
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
});

module.exports = router;
