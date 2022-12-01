const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

router.get("/chefs/:id", (req, res) => {
    const userId = req.params.id;
  
    User
    .findById(userId)
    .populate({
      path: 'userRecipes',
      populate: {path: 'recipes'}})
    .then((response) => {
      res.render("../views/user-profile.hbs", { user: response.data });
    })
    .catch(error => console.log(error));
  });

  module.exports = router;