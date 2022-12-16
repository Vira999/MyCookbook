const mongoose = require('mongoose');
const express = require('express');
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');
const router = express.Router();

/* GET home page */
router.get("/", (req, res) => {
//   User
//   .find()
//   .then(users => {
//     res.render("index", { users })
//   })
// });
  Recipe
  .find()
  .populate("title creator image")
  .populate({
    path: 'creator',
    populate:{
      path: 'username',
      model: 'User',
    }
  })
  .then(recipes => {
    res.render("index", { recipes })
  })
});
//   const loggedInNavigation = req.session.hasOwnProperty('currentUser');
//   const userId = req.session.currentUser._id 

//   if(loggedInNavigation){
//   Recipe
//   .find()
//   .populate("creator")
//   .then(recipes => {
//     res.render("index", { recipes, loggedInNavigation, userId })
//   })
//   }
//   else {
//     Recipe
//   .find()
//   .populate("creator")
//   .then(recipes => {
//     res.render("index", { recipes })
//   })
//   }
// });

module.exports = router;