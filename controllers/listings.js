const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.renderIndex = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings }); //? [ correct: "listings/index.ejs" /\ wrong: "/listings/index.ejs" ]
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "Listing added successfully!");
  res.redirect("/listings"); //? [ correct: "/listings" /\ wrong: "/listings/" ]
};

module.exports.showListing = async (req, res, next) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesn't exists!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.editListingForm = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exists!");
    return res.redirect("/listings");
  }

  let originalImageURL = listing.image.url;
  originalImageURL = originalImageURL.replace("/upload", "/upload/h_300/w_250");
  res.render("listings/edit.ejs", { listing, originalImageURL });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

//? if you want to be redirected to "/listings/:id" page then u have to [ res.redirect(`/listings/${id}`) ] not [ res.redirect("/listings/:id") ] because "/listings/:id" --> this whole is s string value not an actual value, while `/listings/${id}` puts the actual value of id like  [ /listings/65d2b5c8e123456789abcdef ] n that's it.

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
