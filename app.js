//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const schema = require(__dirname + "/models/model.js")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')
//const md5 = require("md5");
//const bcrypt = require("bcrypt");
//const saltRounds = 10;
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set("useCreateIndex", true)


const User = new mongoose.model("User", schema.userSchema);
const Secret = new mongoose.model("Secret", schema.secretSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })
);
app.get("/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/secrets");
    });

app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
})

app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    }
    else {
        res.redirect("/login");
    }
})

app.post("/register", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })
})

app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })
})

app.get("/submit", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("submit");
    }
    else {
        res.redirect("/login");
    }
})
app.post("/submit", function (req, res) {
    const submittedSecret = req.body.secret;
    User.findOne({ _id: req.user.id }, function (err, foundList) {
        if (!err) {
            const newSecret = new Secret({
                userId: foundList._id,
                secrets: submittedSecret,
                created_on: Date.now()
            })
            newSecret.save();
            res.redirect("/secrets");
        }
        else {
            console.log("secret entry failed");
            res.redirect("/secrets");
        }
    })

})
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("server started on http://localhost:3000");
})

//bcrypy hash function
// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {})
//bcrypt compare function
// bcrypt.compare(password, foundUser.password, function(err, result){})


// app.post("/submit", function (req, res) {
//     const submittedSecret = req.body.secret;
//     User.findOne({ _id: req.user.id }, function (err, foundList) {
//         console.log(foundList)
//         if (!err) {
//             const newSecret = new Secret({
//                 secrets: submittedSecret,
//                 created_on: Date.now()
//             })
//             console.log(newSecret)
//             foundList.secrets.push(newSecret);
//             foundList.save();
//             res.redirect("/secrets");
//         }
//         else {
//             console.log(err);
//             res.redirect("/secrets");
//         }
//     })
// })