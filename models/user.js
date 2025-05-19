const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

//* Note: the *passportLocalMongoose* automatically adds username and password for the user, hence no need to mention while building the model.

module.exports = mongoose.model("User", userSchema);
