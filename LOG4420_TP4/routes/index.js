const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "Accueil" });
});

module.exports = router;
