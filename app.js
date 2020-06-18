//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const schema = require(__dirname + "/models/model.js")
//const md5 = require("md5");
//const bcrypt = require("bcrypt");
//const saltRounds = 10;
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false 
}))

app.use(passport.initialize());
app.use (passport.session());

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set("useCreateIndex", true)
const User = new mongoose.model("User", schema.userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("home");
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
})
app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save(function (err) {
            if (!err) {
                console.log("User Creation Successful");
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    })

})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
})

app.listen(3000, function () {
    console.log("server started on http://localhost:3000");
})

//bcrypy hash function
// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {})
//bcrypt compare function
// bcrypt.compare(password, foundUser.password, function(err, result){})