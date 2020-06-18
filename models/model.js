const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
//const encrypt = require("mongoose-encryption");
var findOrCreate = require('mongoose-findorcreate')

const secretSchema = new mongoose.Schema({
    secrets: String,
    created_on: Date
})
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secrets: [secretSchema]
})

//used previously for mongoose-encryption
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); 

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
exports.userSchema = userSchema;
exports.secretSchema = secretSchema;