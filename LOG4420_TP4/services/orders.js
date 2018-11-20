"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ValidationError = require("../lib/validation.error");
const validator = require("validator");

const Order = new Schema({
  id: {type: Number, unique: true},
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  products: Array
}, {versionKey: false});

const Model = mongoose.model("Order", Order);

const ProductsService = require("../services/products");

class OrdersService {

  constructor() {
    this.productsService = new ProductsService();
  }

  async validate(order) {
    const errors = [];
    if (isNaN(order.id)) {
      errors.push({
        "prop": "id",
        "error": "Id must be an number"
      });
    } else if (!Number.isInteger(order.id)) {
      errors.push({
        "prop": "id",
        "error": "Id must be an integer"
      });
    }

    if (!order.firstName) {
      errors.push({
        "prop": "firstName",
        "error": "First name must be defined"
      });
    } else if (order.firstName.length === 0) {
      errors.push({
        "prop": "firstName",
        "error": "First name must not be an empty string"
      });
    }

    if (!order.lastName) {
      errors.push({
        "prop": "lastName",
        "error": "Last name must be defined"
      });
    } else if (order.lastName.length === 0) {
      errors.push({
        "prop": "lastName",
        "error": "Last name must not be an empty string"
      });
    }

    if (!order.email) {
      errors.push({
        "prop": "email",
        "error": "Email must be defined"
      });
    } else if (!validator.isEmail(order.email)) {
      errors.push({
        "prop": "email",
        "error": "Email must be valid"
      });
    }

    if (!order.phone) {
      errors.push({
        "prop": "phone",
        "error": "Phone must be defined"
      });
    } else if (!validator.isMobilePhone(order.phone, ["en-CA"])) {
      errors.push({
        "prop": "phone",
        "error": "Phone must be valid"
      });
    }

    if (!order.products) {
      errors.push({
        "prop": "products",
        "error": "Products must be defined"
      });
    } else if (order.products.length === 0) {
      errors.push({
        "prop": "products",
        "error": "Products must not be empty"
      });
    } else if (!order.products.every(p => p.id && Number.isInteger(p.id) && p.quantity && Number.isInteger(p.quantity) && p.quantity > 0)) {
      errors.push({
        "prop": "products",
        "error": "Every product must be valid"
      })
    } else {
      const everyProducts = await Promise.all(order.products.map(p => this.productsService.getById(p.id)));
      const everyProductsExists = everyProducts.every(p => p);
      if (!everyProductsExists) {
        errors.push({
          "prop": "products",
          "error": "Every product must have a valid product id"
        });
      }
    }

    return errors;
  }

  async create(order) {
    const errors = await this.validate(order);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const count = await Model.count({
      id: order.id
    }).exec();

    if (count > 0) {
      errors.push({
        "prop": "id",
        "error": "Id already exist"
      });
    }

    return await Model.create(order);
  }

  getAll() {
    return Model.find().exec();
  };

  getById(id) {
    return Model.findOne({
      id
    }).exec();
  }

  removeById(id) {
    return Model.deleteOne({
      id
    }).exec();
  }

  removeAll() {
    return Model.deleteMany({}).exec();
  }
}

module.exports = OrdersService;

