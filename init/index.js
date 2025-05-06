const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../Models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main(req, res) {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6810f8ad0dbe1cf48c03d3d8",
  }));
  await Listing.insertMany(initdata.data);
  console.log("Data Was initialized");
};

initDB();
