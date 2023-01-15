const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/User.model');
const Recipe = require('../models/Recipe.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');
const isSameChef = require('../middleware/isSameChef');
const fileUploader = require("../config/cloudinary.config");
const router = express.Router();

router.get("auth/profile", async (req, res, next) => {
    //const userId = req.session.currentUser._id
    const user = session.currentUser
    const userId = user._id
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
router.get("/edit-profile", (req, res) => {
  const id = req.session.currentUser._id;
  //const loggedInUserId = req.session?.currentUser?._id;
  //const isSameChef = loggedInUserId === chefId;

  User
  .findById(id)
  .then((chef) => {
    res.render("edit-profile",  chef)
  })
})

  router.post("/edit-profile", fileUploader.single("profileImage"), (req, res) => {
    // const chefId = req.params.id;
    // const loggedInUserId = req.session?.currentUser?._id;
    // const isSameChef = loggedInUserId === chefId;
    const userId = req.session.currentUser._id
    const { firstName, lastName, username, userBio, profileImage }  = req.body;
    let imgUrl;

    if (req.file){
      imgUrl = req.file.path;
    } else {
      imgUrl = profileImage;
    }

    if(userId){
      User.findByIdAndUpdate(userId, { firstName, lastName, username, userBio, profileImage: imgUrl }, {new:true})
        .then(() => {
          res.redirect('/auth/profile')
        })
        .catch(err => console.error(err))
    }
    else {
      res.redirect('/auth/profile')
    }
   });

   router.post('/delete-profile', (req, res, next) => {
    userId = req.session.currentUser._id
    User.findByIdAndDelete(userId)
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        console.log('error deleting user', err);
        next();
    });
});



   router.get("/chefs", (req, res) => {
    User.find()
    .then (allChefs => res.render('chefs/chefs', { chefs: allChefs }))
    .catch(err => res.send(err))
});



  module.exports = router;