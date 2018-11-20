"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ValidationError = require("../lib/validation.error");

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

/**
 * Applies a sorting criteria to the specified 5products list.
 *
 * @param products          The product list to sort.
 * @param sortingCriteria   The sorting criteria to use. The available values are:
 *                            - price-asc (ascendant price);
 *                            - price-dsc (descendant price);
 *                            - alpha-asc (alphabetical order ascending);
 *                            - alpha-dsc (alphabetical order descending).
 * @returns {*}             The products list sorted.
 */
function applySortingCriteria(products, sortingCriteria) {
  if (products) {
    switch (sortingCriteria) {
      case "price-asc":
        products = products.sort(function(a, b) {
          return a["price"] - b["price"];
        });
        break;
      case "price-dsc":
        products = products.sort(function(a, b) {
          return b["price"] - a["price"];
        });
        break;
      case "alpha-asc":
        products = products.sort(function(a, b) {
          var nameA = a["name"].toLowerCase();
          var nameB = b["name"].toLowerCase();
          if (nameA > nameB) {
            return 1;
          } else if (nameA < nameB) {
            return -1;
          }
          return 0;
        });
        break;
      case "alpha-dsc":
        products = products.sort(function(a, b) {
          var nameA = a["name"].toLowerCase();
          var nameB = b["name"].toLowerCase();
          if (nameA > nameB) {
            return -1;
          } else if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
        break;
    }
  }
  return products;
}

class ProductsService {
  constructor() {
    this.categories = ["cameras", "computers", "consoles", "screens"];
  }

  validate(product) {
    const error = [];
    if (isNaN(product.id)) {
      error.push({
        "prop": "id",
        "error": "Id must be an number"
      });
    } else if (!Number.isInteger(product.id)) {
      error.push({
        "prop": "id",
        "error": "Id must be an integer"
      });
    }

    if (!product.name) {
      error.push({
        "prop": "name",
        "error": "Name must defined"
      });
    } else if (product.name.length === 0) {
      error.push({
        "prop": "name",
        "error": "Name must not be an empty string"
      });
    }

    if (isNaN(product.price)) {
      error.push({
        "prop": "price",
        "error": "Price must be an number"
      });
    } else if (product.price < 0) {
      error.push({
        "prop": "price",
        "error": "Price must be an positive"
      });
    }

    if (!product.image) {
      error.push({
        "prop": "image",
        "error": "Image must defined"
      });
    } else if (product.image.length === 0) {
      error.push({
        "prop": "image",
        "error": "Image must not be an empty string"
      });
    }

    if (!product.category) {
      error.push({
        "prop": "category",
        "error": "Category must defined"
      });
    } else if (this.categories.indexOf(product.category) < 0) {
      error.push({
        "prop": "category",
        "error": "Category must be cameras, computers, consoles or screens"
      });
    }

    if (!product.description) {
      error.push({
        "prop": "description",
        "error": "Description must defined"
      });
    } else if (product.description.length === 0) {
      error.push({
        "prop": "description",
        "error": "Description must not be an empty string"
      });
    }

    if (!product.features) {
      error.push({
        "prop": "features",
        "error": "Features must defined"
      });
    } else if (product.features.length === 0) {
      error.push({
        "prop": "features",
        "error": "Features must not be an empty array"
      });
    } else {
      const errors = product.features.filter(value => value.length === 0);
      if (errors.length > 0) {
        error.push({
          "prop": "features",
          "error": "Features must not contains empty string"
        });
      }
    }

    return error;
  }

  async create(product) {
    const errors = this.validate(product);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const count = await Model.count({
      id: product.id
    }).exec();

    if (count > 0) {
      errors.push({
        "prop": "id",
        "error": "Id already exist"
      });
    }

    return await Model.create(product);
  }

  async getAll(category, criteria) {
    const categories = [];
    if (category) {
      categories.push(category);
    } else {
      categories.push(...this.categories);
    }
    if (category && this.categories.indexOf(category) < 0) {
      throw new ValidationError({
        prop: "category",
        message: "Category doesn't exist"
      })
    }

    if (!criteria) {
      criteria = "price-asc";
    }
    if (["alpha-asc", "alpha-dsc", "price-asc", "price-dsc"].indexOf(criteria) < 0) {
      throw new ValidationError({
        prop: "criteria",
        message: "Criteria doesn't exist"
      });
    }

    const res = await Model.find({
      category: {
        $in: categories
      }
    }).exec();

    return applySortingCriteria(res, criteria);
  };

  getAllFromIds(ids) {
    return Model.find({
      id: {
        $in: ids
      }
    }).exec();
  }

  async getById(id) {
    return await Model.findOne({
      id
    }).exec();
  }

  async removeById(id) {
    return await Model.deleteOne({
      id
    }).exec();
  }

  async removeAll() {
    return await Model.deleteMany({}).exec();
  }
}

module.exports = ProductsService;
