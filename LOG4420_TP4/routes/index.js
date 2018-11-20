const express = require("express");
const router = express.Router({});
const ProductsService = require("../services/products");

const services = new ProductsService();

router.get("/", (req, res) => {
  res.render("index", { title: "Accueil" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "Accueil" });
});

router.get("/produits", async (req, res) => {
  const products = await services.getAll();
  res.render("products", { title: "Produits", products });
});

router.get("/produits/:id", (req, res) => {
  res.render("product", { title: "Produit" });
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
