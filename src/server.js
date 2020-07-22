const express = require("express");
const ShortUrl = require("../models/shortUrl");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost/urls", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongoDb... "));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.post("/shorten", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.get("/:shortUrl", async (req, res) => {
  const target = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (target === null) return res.sendStatus(404);
  target.clicks++;
  target.save();
  res.redirect(target.full);
});

const port = process.env.PORT || 5000;
app.listen(port);
