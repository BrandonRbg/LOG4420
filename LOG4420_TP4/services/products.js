"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
  id: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: Array
}, { versionKey: false });

const Model = mongoose.model("Product", Product);

class ProductsService {
  getAll() {
    return Model.find({});
  };
}

module.exports = ProductsService;
