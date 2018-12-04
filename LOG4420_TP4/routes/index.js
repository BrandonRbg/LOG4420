const express = require("express");
const router = express.Router({});
const ProductsService = require("../services/products");
const OrdersService = require("../services/orders");

const services = new ProductsService();
const ordersService = new OrdersService();

function getItemCount(cartItems) {
  let total = 0;
  for (const item of cartItems) {
    total += item.quantity;
  }

  return total;
}

router.get("/", (req, res) => {
  res.render("index", { title: "Accueil", itemCount: getItemCount(req.session.cartItems), tab: "index" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "Accueil", itemCount: getItemCount(req.session.cartItems), tab: "index" });
});

router.get("/produits", async (req, res) => {
  const products = await services.getAll();
  res.render("products", { title: "Produits", products, itemCount: getItemCount(req.session.cartItems), tab: "products" });
});

router.get("/produits/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.redirect("/404");
  }

  const product = await services.getById(req.params.id);
  if (!product) {
    return res.redirect("/404");
  }

  return res.render("product", { title: "Produit", product, itemCount: getItemCount(req.session.cartItems), tab: "products" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { itemCount: getItemCount(req.session.cartItems), tab: "contact" });
});

router.get("/404", (req, res) => {
  return res.render("404", {title: "Page non trouvée!", itemCount: getItemCount(req.session.cartItems)});
});

router.get("/commande", (req, res) => {
  res.render("order", { itemCount: getItemCount(req.session.cartItems) });
});

router.get("/confirmation", async (req, res) => {
  const orders = await ordersService.getAll();
  const ordersCount = orders.length;
  const lastOrder = orders[ordersCount - 1];
  res.render("confirmation", {
    confirmationNumber: ordersCount.toString().padStart(4, "0"),
    lastOrder: lastOrder || {}
  });
});

router.get("/panier", async (req, res) => {
  const cartItems = req.session.cartItems;
  const products = await services.getAllFromIds(cartItems.map(value => value.productId));
  cartItems.forEach(item => {
    item.product = products.find(value => value.id === item.productId);
  });
  res.render("shopping-cart", { title: "Panier", products: cartItems, itemCount: getItemCount(req.session.cartItems) });
});

module.exports = router;
