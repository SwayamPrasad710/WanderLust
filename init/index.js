const mongoose = require("mongoose");
const intiData = require("./data.js");
const Listing = require("../models/listing.js"); //? acquiring the model design

//! Initializing all the data in (data.js)
main()
  .then((res) => {
    console.log("DB Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({}); //* first delete all the sample data from the db --> clean the db 1st

  intiData.data = intiData.data.map((obj) => ({
    ...obj,
    owner: "67f28a15f286e32f850c8f6f",
  }));

  await Listing.insertMany(intiData.data); //* Inserting all the actual data after deleting the sample data from db
  console.log("Data was initialized.");
};

initDB(); //? finally calling the fn to insert all the data into the database.
