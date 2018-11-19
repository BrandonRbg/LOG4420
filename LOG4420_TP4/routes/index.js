const express = require("express");
const router = express.Router({});

router.get("/", (req, res) => {
  res.render("index", { title: "Accueil" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "Accueil" });
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
