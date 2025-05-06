const express = require("express");
const router = express.Router();
const searchController = require("../Controllers/searchController");
const wrapAsync = require("../utils/wrapAsync");

// Search route to find listings based on filters
router.get("/search", wrapAsync(searchController.searchListings));

// Clone info page route for when no results are found
router.get("/clone-info", wrapAsync(searchController.renderCloneInfo));

module.exports = router;
