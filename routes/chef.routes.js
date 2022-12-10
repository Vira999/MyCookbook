const express = require('express');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');
const isSameChef = require('../middleware/isSameChef');
const fileUploader = require("../config/cloudinary.config");
const router = express.Router();

router.get("/chefs/", (req, res) => {
    User.find()
    .then (allChefs => res.render('../views/chefs.hbs', { chefs: allChefs}))
    .catch(err => res.send(err))
});

router.get("/chefs/:id", (req, res) => {
    const chefId = req.params.id;
    const loggedInUserId = req.session?.currentUser?._id;
  
    User
    .findById(chefId)
    .populate({
      path: 'userRecipes',
      populate: {path: 'recipes'}})
    .then((response) => {
      const isSameChef = loggedInUserId === chefId
      const isNotSameChef = loggedInUserId !== chefId
      if(isSameChef){
        res.render("../views/user-profile.hbs", { user: response.data, isSameChef })
      }
      else {
      res.render("../views/user-profile.hbs", { user: response.data, isNotSameChef })
    }
    })
    .catch(error => console.log(error));
  });

  router.get("/chef/:id/edit", (req, res) => {
    const chefId = req.params.id;
    const loggedInUserId = req.session?.currentUser?._id;
    const isSameChef = loggedInUserId === chefId;

    if(!isSameChef){
      res.render("/");
    }
    else {
      User
      .findById(chefId)
      .then((chef) => {
        res.render("../views/edit-profile.hbs", { chef })
      })
    }
  })

  router.post("/chef/:id/edit", isSameChef, fileUploader.single("imageUrl"), (req, res) => {
    const chefId = req.params.id;
    const loggedInUserId = req.session?.currentUser?._id;
    const isSameChef = loggedInUserId === chefId;
    const { firstName, lastName, username, userBio }  = req.body;
    const { path } = req.file;

    User.findByIdAndUpdate(chefId, { firstName, lastName, username, userBio, profileImage: path }, {new:true})
        .then(() => {
          res.redirect('../views/chefs.hbs')
        })
        .catch(err => console.error(err))
   }
 )



  module.exports = router;