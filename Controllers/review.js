const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  const reviewData = req.body.review;

  let listing = await Listing.findById(id);
  let newReview = new Review(reviewData);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, review_id } = req.params;
  //Delete ref from listings
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  //Delete the review itself
  await Review.findByIdAndDelete(review_id);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
