const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
//const encrypt = require("mongoose-encryption");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

//used previously for mongoose-encryption
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); 

userSchema.plugin(passportLocalMongoose);
exports.userSchema = userSchema;