const express = require("express");
const router = express.Router({});

router.get("/", (req, res) => {
  res.render("index", { title: "Accueil" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "Accueil" });
});

router.get("/produits", (req, res) => {
  res.render("products", { title: "Produits" });
});

router.get("/produits/:id", (req, res) => {
  res.render("product", { title: "Produit" });
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
