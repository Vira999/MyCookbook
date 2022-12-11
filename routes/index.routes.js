const express = require('express');
const recipe = require('../models/Recipe.model');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const loggedInNavigation = req.session.hasOwnProperty('currentUser');
  const userId = req.session.currentUser._id 

  if(loggedInNavigation){
  Recipe
  .find()
  .populate("creator")
  .then(recipes => {
    res.render("index", { recipes, loggedInNavigation, userId })
  })
  }
  else {
    Recipe
  .find()
  .populate("creator")
  .then(recipes => {
    res.render("index", { recipes })
  })
  }
});

module.exports = router;