// Import required modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Import custom routers
const indexRouter = require("./routes/index");
const apiAuthRouter = require("./routes/apiAuth");
const partnerRouter = require("./routes/partner");

// Load environment variables from .env file
require("dotenv").config();

// Initialize express app
const app = express();

// Set up EJS as the view engine for HTML files
app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));

// Middleware for logging HTTP requests
app.use(logger("dev"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing cookies
app.use(cookieParser());

// Set up static file serving from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to HTML
app.set("view engine", "html");

// Define routes for the application
app.use("/", indexRouter);
app.use("/auth", apiAuthRouter);
app.use("/partner", partnerRouter);

// Export the app for use in other files
module.exports = app;
