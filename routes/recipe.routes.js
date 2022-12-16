const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn')//add file where located
const fileUploader = require("../config/cloudinary.config");

const recipe = require('../models/Recipe.model');
const comment = require('../models/Comments.model'); 

 
//READ: list all recipes
router.get('/recipes', (req, res, next) => {
    recipe.find()
    .then(recipes => {
        res.render('recipes/recipe-list', { recipes });
    })
    .catch(err => {
        console.log('error getting recipes from the DB', err);
        next(err);
    });
});

//CREATE: display form
router.get('/recipes', isLoggedIn, (req, res, next) => {
    res.render('recipes/create-recipes');
});
// GET route to retrieve and display all the recipes
router.get('/', isLoggedIn, (req, res) => {
  res.render('recipe/index');
});

router.post('/create', isLoggedIn, (req, res) => {
    console.log(req.body)
    const { title,
         time,
        date,
        creator,
        image,
        ingredients,
        instruction} = req.body;
    
   recipe.create({ 
   title,
   time,
   date,
   creator,
   image,
   ingredients,
   instruction})
        .then(() => res.redirect('recipes/create-recipes'))
        .catch(err => console.log(err))
});

router.get('/search', isLoggedIn,  (req, res) => {
    const { recipeName } = req.query;

    recipe.findOne({title: recipeName})
        .then(foundByRecipe => {
            res.render('recipes/recipe-details', {singleRecipe: foundByRecipe})
        })
        .catch(err => console.log(err))
});

//READ: Recipe details
router.get('/recipes/:recipeId', (req, res, next) => {
  const id = req.params.recipeId;

  recipe.findById(id)
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
   
    recipe.findById(recipeId)
        .then(recipeFound => {
            console.log('recipeFound', recipeFound)
            res.render('/recipes', {singleRecipe: recipeFound})
        })
        .catch(err => console.log(err))
});

//UPDATE: process form
router.post('/recipes/:recipeId/edit', isLoggedIn, fileUploader.single('recipe-image'), (req, res, next) => {
    const { recipeId } = req.params;
    let { recipeName, cookTime, image, instruction, ingredients } = req.body;
  
    recipe.findByIdAndUpdate(recipeId, { recipeName, cookTime, image, instruction, ingredients}, {new: true})
    .then(() => {
        res.redirect(`/recipes/${recipeId}`);
    })
    .catch(err => {
        res.redirect('recipes/edit-recipes');
    });
});

//DELETE FROM RECIPES LIST PAGE
router.get('/recipes/:recipeId/delete', isLoggedIn, (req, res, next) => {
    recipe.findByIdAndDelete(req.params.recipeId)
    .then(() => {
        res.redirect('/recipes');
    })
    .catch(err => {
        console.log('error deleting recipe', err);
        next();
    });
});


//DELETE FROM EDIT PAGE
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


router.get('/comments/:id', (req, res) => {
 
     
      Comment.find({ recipeId: req.params.id }).then(comments => {
       console.log(comments);
        res.render(`views/comments-show.hbs`, { comments: comments })

    }).catch((err) => {
      // catch errors
      console.log(err.message)
    });
  });
 
    

 
module.exports = router;