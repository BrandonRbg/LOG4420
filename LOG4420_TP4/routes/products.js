const express = require("express");
const router = express.Router({});
const ProductsService = require("../services/products");

const service = new ProductsService();

router.get("/", (req, res) => {
  service.getAll();
  res.render("products", { title: "Produits" });
});

router.get("/:id", (req, res) => {
  res.render("product", { title: "Produit" });
});

module.exports = router;
