const Listing = require("../Models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  const categories = Listing.schema.path("category").enumValues;
  res.render("./listings/index.ejs", {
    allListings,
    categories,
    activeCategory: category,
  });
};

module.exports.renderNewForm = async (req, res) => {
  const categories = Listing.schema.path("category").enumValues;
  res.render("./listings/new.ejs", { categories });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "This listing no longer exists!!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  //we can also write here like {id, title etc} = req.body; but we will use another approach
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedLisiting = await newListing.save();
  // console.log(savedLisiting);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  const categories = Listing.schema.path("category").enumValues;
  if (!listing) {
    req.flash("error", "This listing no longer exists!!");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing, categories });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const updateListing = req.body.listing;

  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  if (req.file) {
    updateListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  updateListing.geometry = response.body.features[0].geometry;

  await Listing.findByIdAndUpdate(id, updateListing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
