const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT,
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
};
