const express = require("express");
const router = express.Router({});
const ProductsService = require("../services/products");

const service = new ProductsService();

router.get("/", async (req, res) => {
  const category = req.query["category"];
  const criteria = req.query["criteria"];

  try {
    res.status(200).json(await service.getAll(category, criteria));
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

router.get("/:id", async (req, res) => {
  if (isNaN(req.params["id"])) {
    return res.status(404).end();
  }

  const result = await service.getById(+req.params["id"]);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await service.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

router.delete("/", async (req, res) => {
  try {
    await service.removeAll();
    return res.status(204).end();
  } catch (e) {
    res.status(500).end();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await service.removeById(req.params.id);
    if (result.deletedCount > 0) {
      return res.status(204).end();
    }
    return res.status(404).end();
  } catch (e) {
    res.status(404).end();
  }
});

module.exports = router;
