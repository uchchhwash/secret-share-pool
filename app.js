//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = requrie("ejs");

const app = express();

app.use(express.static("public"));
app.set("view enginer", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function(req, res) {
    console.log("");
})

app.listen(3000, function() {
    console.log("server started on http://localhost:3000");
})