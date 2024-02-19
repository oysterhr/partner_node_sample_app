const express = require("express");

// Importing the database models
const db = require("../models");

// Creating a new router instance
const router = express.Router();

// Route handler for the root path '/'
router.get("/", async (req, res, next) => {
  // Checking if a client with the given client ID exists in the database
  const hasClient = await db.Client.findOne({
    where: { clientId: process.env.OYSTER_CLIENT_ID },
  });

  // Rendering the 'index' view and passing the title, authorization URL, and client existence status
  res.render("index", {
    title: "Partner API Node App",
    authorizationUrl: process.env.OYSTER_AUTHORIZATION_URL,
    hasClient,
  });
});

// Exporting the router module for use in other parts of the application
module.exports = router;
