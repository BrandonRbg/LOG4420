const express = require("express");
const router = express.Router({});
const ProductsService = require("../services/products");

const service = new ProductsService();

router.get("/", (req, res) => {
  res.status(200).json(req.session.cartItems);
});


router.get("/:productId", (req, res) => {
  const items = req.session.cartItems;
  const item = items.filter(v => v.productId === +req.params.productId);

  if (item.length > 0) {
    res.status(200).json(item[0]);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  if (!req.body.productId || !req.body.quantity) {
    return res.status(400).end();
  } else if (isNaN(req.body.productId) || isNaN(req.body.quantity)) {
    return res.status(400).end();
  } else if (+req.body.quantity <= 0) {
    return res.status(400).end();
  }

  const product = await service.getById(req.body.productId);
  if (!product) {
    return res.status(400).end();
  }

  if (!req.session.cartItems) {
    req.session.cartItems = [];
  }

  req.session.cartItems.push({
    productId: req.body.productId,
    quantity: req.body.quantity
  });

  res.status(201).end();
});

router.put("/:productId", (req, res) => {
  if (!req.body.quantity || isNaN(req.body.quantity) || +req.body.quantity <= 0) {
    return res.status(400).end();
  }

  const items = req.session.cartItems.filter(v => v.productId === +req.params.productId);
  if (items.length === 0) {
    return res.status(404).end();
  }

  items[0].quantity = req.body.quantity;
  return res.status(204).end();
});

router.delete("/", (req, res) => {
  req.session.cartItems = [];
  res.status(204).end();
});

router.delete("/:productId", (req, res) => {
  const item = req.session.cartItems.map(v => v.productId).indexOf(+req.params.productId);
  if (item === -1) {
    return res.status(404).end();
  }

  req.session.cartItems.splice(item, 1);
  return res.status(204).end();
});

module.exports = router;
