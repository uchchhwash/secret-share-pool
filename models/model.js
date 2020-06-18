const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const secret = "zzxxcc";
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

exports.userSchema = userSchema;