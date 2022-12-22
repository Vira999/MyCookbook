const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn')//add file where located
const fileUploader = require("../config/cloudinary.config");

const Recipe = require('../models/Recipe.model');
const Comment = require('../models/Comment.model'); 

 
//READ: list all recipes
router.get('/recipes', (req, res, next) => {
    Recipe.find()
    .then(recipes => {
        res.render('recipes/recipe-list', { recipes });
    })
    .catch(err => {
        console.log('error getting recipes from the DB', err);
        next(err);
    });
});

//CREATE: display form
router.get('/recipes/create', isLoggedIn, (req, res, next) => {
    res.render('recipes/create-recipes');
});

router.post('/create', isLoggedIn, (req, res) => {
    console.log(req.body)
    const { title,
         time,
        date,
        creator,
        recipeImage,
        ingredients,
        instruction} = req.body;
    
   Recipe.create({ 
   title,
   time,
   date,
   creator,
   recipeImage,
   ingredients,
   instruction})
        .then(() => res.redirect('recipes/create-recipes'))
        .catch(err => console.log(err))
});

router.get('/recipes/search', isLoggedIn,  (req, res) => {
    const { recipeName } = req.query;

   Recipe.findOne({title: recipeName})
        .then(foundByRecipe => {
            res.render('recipes/recipe-details', {singleRecipe: foundByRecipe})
        })
        .catch(err => console.log(err))
});

//READ: Recipe details
router.get('/recipes/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;

  Recipe.findById(id)
  .then(recipeDetails => {
      res.render('recipes/recipe-details', recipeDetails);
  })
  .catch(err => {
      console.log('error getting recipe details from DB', err);
      next(err);
  });
});

router.get('/:recipeId', isLoggedIn, (req, res) => {
    const { recipeId } = req.params;
   
    Recipe.findById(recipeId)
        .then(recipeFound => {
            console.log('recipeFound', recipeFound)
            res.render('/recipes', {singleRecipe: recipeFound})
        })
        .catch(err => console.log(err))
});

//UPDATE: process form
router.get('/recipes/:recipeId/edit', isLoggedIn, (req, res) => {
    const loggedInNavigation = req.session.hasOwnProperty('currentUser'); 
    res.render('recipes/edit-recipes', {loggedInNavigation})
})

router.post('/recipes/:recipeId/edit', isLoggedIn, fileUploader.single('recipe-image'), (req, res, next) => {
    const { recipeId } = req.params;
    let { recipeName, cookTime, recipeImage, instruction, ingredients } = req.body;
  
    Recipe.findByIdAndUpdate(recipeId, { recipeName, cookTime, recipeImage, instruction, ingredients}, {new: true})
    .then(() => {
        res.redirect(`/recipes/${recipeId}`);
    })
    .catch(err => {
        console.log('error deleting recipe', err);
    });
});

//DELETE FROM PAGE
router.post('/recipes/:recipeId/delete', isLoggedIn, (req, res, next) => {
    Recipe.findByIdAndDelete(req.params.recipeId)
    .then(() => {
        res.redirect('/recipes');
    })
    .catch(err => {
        console.log('error deleting recipe', err);
        next();
    });
});


router.get('/comment/:id', (req, res) => {
 
     
      Comment.find({ recipeId: req.params.id }).then(comments => {
       console.log(comments);
        res.render(`views/comments-show.hbs`, { comments: comments })

    }).catch((err) => {
      // catch errors
      console.log(err.message)
    });
  });
 
    

 
module.exports = router;