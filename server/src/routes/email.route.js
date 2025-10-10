const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const config = require("../config");

// Set SendGrid API key (expects config.sendgrid.apiKey)
sgMail.setApiKey(config.sendgrid.apiKey);

// In-memory cooldown tracker (recipient email -> timestamp ms)
// Note: This is ephemeral and will reset on server restart. For production use a shared store (Redis).
const lastSentAt = new Map();
const COOLDOWN_MS = Number(process.env.EMAIL_COOLDOWN_MS) || 60_000; // default 60 seconds

// POST / - send a gift email
router.post("/", async (req, res) => {
  const { toEmail, fromName, amazonUrl } = req.body || {};

  // Basic validation
  if (!toEmail || !fromName || !amazonUrl) {
    return res.status(400).json({ error: "toEmail, fromName and amazonUrl are required" });
  }

  // Cooldown check
  const now = Date.now();
  const last = lastSentAt.get(toEmail);
  if (last && now - last < COOLDOWN_MS) {
    const retryIn = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
    return res.status(429).json({ error: `Please wait ${retryIn} seconds before sending another email to this recipient.` });
  }

  const msg = {
    to: toEmail,
    from: config.email && config.email.from ? config.email.from : "snakesandhackers2@sayantanmondal.com",
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
    // record send time
    lastSentAt.set(toEmail, Date.now());
    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("SendGrid error:", error?.message || error);
    if (error?.response?.body) console.error(error.response.body);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
