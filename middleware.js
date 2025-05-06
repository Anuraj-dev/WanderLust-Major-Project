const Listing = require("./Models/listing");
const Review = require("./Models/review");
const wrapasync = require("./utils/wrapasync");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //Save redirect URL with proper processing
    if (req.method === "GET") {
      // For GET requests, save as is
      req.session.redirectUrl = req.originalUrl;
    } else if (req.method === "DELETE" || req.method === "POST") {
      // For DELETE/POST operations on reviews, redirect to the listing page
      const pathParts = req.originalUrl.split("/");
      const listingIndex = pathParts.indexOf("listings");
      if (listingIndex !== -1 && listingIndex + 1 < pathParts.length) {
        const listingId = pathParts[listingIndex + 1];
        req.session.redirectUrl = `/listings/${listingId}`;
      } else {
        req.session.redirectUrl = "/listings"; // Default fallback
      }
    }

    req.flash("error", "You need to log in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = wrapasync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "Access denied! You are not the owner of this listing!!"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join();
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join();
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = wrapasync(async (req, res, next) => {
  let { id, review_id } = req.params;
  let review = await Review.findById(review_id).populate("author");
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "Access denied! You are not the author of this review!!"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
});
