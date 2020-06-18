//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { userSchema } = require("./models/model");
const schema = require(__dirname + "/models/model.js")
const dbUrl = "mongodb://localhost:27017/userDB";
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const User = new mongoose.model("User", schema.userSchema);

app.get("/", function(req, res) {
    res.render("home");
})
app.get("/login", function(req, res) {
    res.render("login");
})
app.get("/register", function(req, res) {
    res.render("register");
})
app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err) {
        if (!err) {
            console.log("User Creation Successful");
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
})

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    console.log("login successfull");
                    res.render("secrets");
                }
            }
        }
    })

})

app.listen(3000, function() {
    console.log("server started on http://localhost:3000");
})