const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

// Privacy Policy Route
router.get("/privacy", (req, res) => {
  // Get referer URL or default to listings
  const referer = req.headers.referer || "/listings";
  res.render("static/privacy.ejs", { referer });
});

// Terms of Service Route
router.get("/terms", (req, res) => {
  // Get referer URL or default to listings
  const referer = req.headers.referer || "/listings";
  res.render("static/terms.ejs", { referer });
});

module.exports = router;
