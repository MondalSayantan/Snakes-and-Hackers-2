const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const config = require("../config");

// initialize SendGrid API key
sgMail.setApiKey(config.sendgrid.apiKey);

// POST / - send a gift email
router.post("/", async (req, res) => {
  const { toEmail, fromName, amazonUrl } = req.body || {};

  // basic validation
  if (!toEmail || !fromName || !amazonUrl) {
    return res.status(400).json({ error: "toEmail, fromName and amazonUrl are required" });
  }

  const msg = {
    to: toEmail,
    // consider moving 'from' into config in the future
    from: "snakesandhackers2@sayantanmondal.com",
    subject: `You owe a gift to ${fromName}`,
    text: `Greetings, please use the following Amazon link to buy the gift for ${fromName}: ${amazonUrl}. Thanks for playing!`,
    html: `
      <h4>Greetings,</h4>
      <p>Please use the link below to buy the gift for ${fromName}:</p>
      <p><a href="${amazonUrl}">${amazonUrl}</a></p>
      <p>Thanks for playing!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    // better logging for debugging
    console.error("SendGrid error:", error?.message || error);
    if (error?.response?.body) console.error(error.response.body);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
