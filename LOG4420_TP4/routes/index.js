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

router.get("/produits/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.redirect("/404");
  }

  const product = await services.getById(req.params.id);
  if (!product) {
    return res.redirect("/404");
  }

  return res.render("product", { title: "Produit", product });
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/404", (req, res) => {
  return res.render("404", {title: "Page non trouvée!"});
});

router.get("/commande", (req, res) => {
  res.render("order");
});

module.exports = router;
