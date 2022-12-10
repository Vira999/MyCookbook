const express = require('express');
const recipe = require('../models/Recipe.model');
const data = require('.db/index'); // maybe dont need
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  Recipe
  .find()
  .populate("creator")
  .then(recipes => {
    res.render("index", { recipes })
  })
});

module.exports = router;