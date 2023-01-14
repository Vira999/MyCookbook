const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/User.model');
const Recipe = require('../models/Recipe.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');
const isSameChef = require('../middleware/isSameChef');
const fileUploader = require("../config/cloudinary.config");
const router = express.Router();

router.get("/:id", async (req, res, next) => {
    //const userId = req.session.currentUser._id
    const userId = req.params.id
    console.log(`userID ==> ${userId}`)
  
    User
    .findById(userId)
    .populate("userRecipes")
    // .populate({
    //   path: 'userRecipes',
    //   populate: {
    //     path: "recipe",
    //     populate: {
    //       path: "title image",
    //       model: "Recipe",
    //     }
    //   }
    // })
    .then((user) => {
      res.render("/profile", {user})
    })
    .catch(error => console.log(error));
  });

  // router.get("/chefs/:id/edit", (req, res) => {
  //   const chefId = req.session.currentUser._id;
  //   //const loggedInUserId = req.session?.currentUser?._id;
  //   //const isSameChef = loggedInUserId === chefId;

  //   User
  //   .findById(chefId)
  //   .then((chef) => {
  //     res.render("/edit-profile", { chef })
  //   })

    // if(!isSameChef){
    //   res.render(`/chefs/${chefId}`);
    // }
    // else {
    //   User
    //   .findById(chefId)
    //   .then((chef) => {
    //     res.render("/edit-profile", { chef })
    //   })
    // }
  //});

  /* GET EDIT profile */
router.get("/:id/edit", (req, res) => {
  const chefId = req.session.currentUser._id;
  //const loggedInUserId = req.session?.currentUser?._id;
  //const isSameChef = loggedInUserId === chefId;

  User
  .findById(chefId)
  .then((chef) => {
    res.render("edit-profile", { chef })
  })
})

  router.post("/:id/edit", fileUploader.single("imageUrl"), (req, res) => {
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
      res.redirect(`/chefs/${chefId}`)
    }
   });



   router.get("/", (req, res) => {
    User.find()
    .then (allChefs => res.render('chefs/chefs', { chefs: allChefs }))
    .catch(err => res.send(err))
});



  module.exports = router;