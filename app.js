//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const array = require('lodash/array');

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://kumarsatyarth428:Atlas123@cluster0.m7lmhhy.mongodb.net/dailyDB", {
  serverSelectionTimeoutMS: 30000 // 30 seconds
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const homeStartingContent = "Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing. ";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dailySchema = new mongoose.Schema({
  title: String,
  content: String
});

const Daily = mongoose.model("Daily", dailySchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Daily.find({});
    res.render("home", { love: homeStartingContent, posts: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contact", function (req, res) {
  res.render("contact", { cute: contactContent });
});

app.get("/about", function (req, res) {
  res.render("about", { like: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  const daily = new Daily({
    title: req.body.title,
    content: req.body.post
  });

  try {
    await daily.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/posts/:postname", async function (req, res) {
  const gola = _.lowerCase(req.params.postname);

  try {
    const daily = await Daily.findOne({ title: new RegExp(gola, 'i') });

    if (daily) {
      res.render("post", { ana: daily.title, sat: daily.content });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
