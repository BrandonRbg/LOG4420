const express = require("express");
const router = express.Router({});
const OrdersService = require("../services/orders");

const service = new OrdersService();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await service.getAll());
  } catch (e) {
    res.status(400).json(e.errors);
  }
});

router.get("/:id", async (req, res) => {
  const result = await service.getById(+req.params["id"]);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  try {
    const order = await service.create(req.body);
    res.status(201).json(order);
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
