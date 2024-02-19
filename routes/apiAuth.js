const express = require("express");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const db = require("../models");

const router = express.Router();

// Function to make an API request for authentication
const apiAuthReq = async (data) => {
  return await axios.post("https://api.oysterhr.com/oauth2/token", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// Route to handle the callback after OAuth Authorization
router.get(
  "/callback",
  asyncHandler(async (req, res, next) => {
    // The Authorization Code provided by the Oyster API
    const code = req.query.code;

    // Data required for making the API request
    const data = {
      client_id: process.env.OYSTER_CLIENT_ID,
      client_secret: process.env.OYSTER_CLIENT_SECRET,
      authorization_url: process.env.OYSTER_AUTHORIZATION_URL,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.OYSTER_REDIRECT_URL, // This is the Redirect URL specified when creating you Developer on oysterhr.com
    };

    try {
      // Make the API request for authentication
      const response = await apiAuthReq(data);

      // Extract the access and refresh tokens from the response
      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data;

      // Store the tokens in the database
      await db.Client.findOrCreate({
        where: { clientId: process.env.OYSTER_CLIENT_ID },
        defaults: { accessToken, refreshToken },
      });

      // Redirect to the homepage after successful authentication
      res.redirect("/");
    } catch (error) {
      // Throw an error if the API request fails
      throw JSON.stringify(error.response.data, null, 2);
    }
  })
);

// Route to refresh the access token using the refresh token
router.get(
  "/refresh_token",
  asyncHandler(async (req, res, next) => {
    // Find the client in the database using the client ID
    const client = await db.Client.findOne({
      where: { clientId: process.env.OYSTER_CLIENT_ID },
    });

    // If the client is not found, throw an error
    if (client === null) {
      throw "Client not found";
    }

    // Data required for making the API request to refresh the token
    const data = {
      client_id: process.env.OYSTER_CLIENT_ID,
      client_secret: process.env.OYSTER_CLIENT_SECRET,
      authorization_url: process.env.OYSTER_AUTHORIZATION_URL,
      grant_type: "refresh_token",
      refresh_token: client.refreshToken,
    };

    try {
      // Make the API request to refresh the access token
      const response = await apiAuthReq(data);

      // Extract the new access and refresh tokens from the response
      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data;

      // Update the tokens in the database
      client.set({ accessToken, refreshToken });

      // Save the updated client information
      await client.save();

      // Redirect to the homepage after refreshing the tokens
      res.redirect("/");
    } catch (error) {
      // Throw an error if the API request fails
      throw JSON.stringify(error.response.data, null, 2);
    }
  })
);

module.exports = router;
