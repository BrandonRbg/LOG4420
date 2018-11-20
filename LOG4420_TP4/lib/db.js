"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


mongoose.Promise = global.Promise;

mongoose.connect("mongodb://root:123456Ab@ds111244.mlab.com:11244/log4420-tp4", { useMongoClient: true });
