const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/User.model');
const Recipe = require('../models/Recipe.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');
const isSameChef = require('../middleware/isSameChef');
const fileUploader = require("../config/cloudinary.config");
const router = express.Router();

router.get("/", (req, res) => {
    User.find()
    .then (allChefs => res.render('chefs/chefs.hbs', { chefs: allChefs }))
    .catch(err => res.send(err))
});

router.get("chefs/:id", async (req, res, next) => {
    //const userId = req.session.currentUser._id
    const userId = req.params.id
    console.log(`userID ==> ${userId}`)
  
    User
    .findById(userId)
    .populate("userRecipes")
    .populate({
      path: 'userRecipes',
      populate: {
        path: "recipe",
        populate: {
          path: "title image",
          model: "Recipe",
        }
      }
    })
    .then((user) => {
      res.render("chefs/profile.hbs", {user})
    })
    .catch(error => console.log(error));
  });

  router.get("/chefs/:id/edit", (req, res) => {
    const chefId = req.params.id;
    const loggedInUserId = req.session?.currentUser?._id;
    const isSameChef = loggedInUserId === chefId;

    if(!isSameChef){
      res.render(`/chefs/${chefId}`);
    }
    else {
      User
      .findById(chefId)
      .then((chef) => {
        res.render("/edit-profile", { chef })
      })
    }
  });

  router.post("/chef/:id/edit", fileUploader.single("imageUrl"), (req, res) => {
    const chefId = req.params.id;
    const loggedInUserId = req.session?.currentUser?._id;
    const isSameChef = loggedInUserId === chefId;
    const { firstName, lastName, username, userBio }  = req.body;
    const { path } = req.file;

    if(isSameChef){
      User.findByIdAndUpdate(chefId, { firstName, lastName, username, userBio, profileImage: path }, {new:true})
        .then(() => {
          res.redirect('/chefs')
        })
        .catch(err => console.error(err))
    }
    else {
      res.render(`/chef/${chefId}`)
    }
   });



  module.exports = router;