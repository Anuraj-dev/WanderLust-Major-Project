const Listing = require("../Models/listing");

/**
 * Search listings based on location (regex), country (exact), and max price
 */
module.exports.searchListings = async (req, res) => {
  const { location = "", country = "", maxPrice } = req.query;
  const query = {};

  // Build query based on provided filters
  if (location) query.location = { $regex: location, $options: "i" };
  if (country) query.country = country;
  if (maxPrice) query.price = { $lte: maxPrice };

  try {
    // Find listings matching the query, limit to 50 results
    const results = await Listing.find(query).limit(50);

    if (results.length) {
      // If we have results, render them on the search page
      return res.render("search", { results, query: req.query });
    } else {
      // Otherwise redirect to the clone-info page
      return res.redirect("/clone-info");
    }
  } catch (err) {
    console.error("Search error:", err);
    req.flash("error", "An error occurred during search");
    return res.redirect("/listings");
  }
};

/**
 * Render the clone info page (fallback notice)
 */
module.exports.renderCloneInfo = async (req, res) => {
  res.render("clone-info");
};
