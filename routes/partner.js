const express = require("express");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const db = require("../models");

const router = express.Router();

// Route handler for GET request to '/session'.
// This route demonstrates how to request for a Session Token
router.get(
  "/session",
  asyncHandler(async (req, res, next) => {
    // Find the client in the database using the client ID from the environment variables
    const client = await db.Client.findOne({
      where: { clientId: process.env.OYSTER_CLIENT_ID },
    });

    // If the client is not found, throw an error
    if (client === null) {
      throw "Client not found";
    }

    // Data required for POST request to generate new Session Token
    const data = {
      userName: "un",
      userEmail: "u@e.com",
      companyName: "cn",
      companyEmailDomain: "c.com",
      companyTaxId: "txid",
      userReference: "ur",
      companyReference: "cr",
      context: "START_HIRE",
    };

    try {
      // Make the POST request
      const response = await axios.post(
        "https://api.oysterhr.com/v0.1/embedded/sessions",
        data,
        {
          headers: {
            Authorization: `Bearer ${client.accessToken}`,
          },
        }
      );

      // Redirect to `.../embedded/transfer?token={generate_token}` after receiving new session token
      res.redirect(
        302,
        `https://app.oysterhr.com/embedded/transfer?token=${response.data.data.token}`
      );
    } catch (error) {
      // If an error occurs, throw the error response data
      throw JSON.stringify(error.response.data, null, 2);
    }
  })
);

module.exports = router;
