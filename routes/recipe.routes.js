const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn')//add file where located
const fileUploader = require("../config/cloudinary.config");

const Recipe = require('../models/Recipe.model');
const Comment = require('../models/Comment.model'); 
const User = require('../models/User.model');


//CREATE: display form
router.get('/recipes/create', isLoggedIn, (req, res, next) => {
    res.render('recipes/create-recipes');
});

router.post('/recipes/create', (req, res) => {
    console.log(req.body)
    const { title, creator, ingredients, instructions } = req.body;
    
   Recipe
        .create({ title, creator, ingredients, instructions })
        .then((recipe) => {
            res.redirect(`${recipe._id}`)
            //return User.findByIdAndUpdate(creatorId, { $push: {userRecipes: recipe._id } });
        })
        .catch(err => console.log(err))
});

//UPDATE: recipe form
router.get('/recipes/:recipeId/edit', isLoggedIn, (req, res, next) => {
    const id = req.params.recipeId;

    Recipe.findById(id)
    .then(recipe => {
        res.render('recipes/edit-recipes', recipe)
    })
    .catch(err => {
        console.log('error getting recipe details edit page from DB', err);
        next(err);
    });
})

router.post('/recipes/:recipeId/edit', fileUploader.single('recipeImage'), (req, res, next) => {
    const id = req.params.recipeId;
    const { title, recipeImage, instructions, creator, ingredients } = req.body;
    let imageUrl;

    if (req.file){
        imageUrl = req.file.path;
    } else {
        imageUrl = recipeImage;
    }
  
    Recipe.findByIdAndUpdate(id, { title, recipeImage: imageUrl, instructions, creator, ingredients }, { new: true })
    .then(() => {
        res.redirect(`/recipes/${id}`);
    })
    .catch(err => {
        console.log('error editing recipe', err);
    });
});


//DELETE  RECIPE FROM PAGE
router.post('/recipes/:recipeId/delete', (req, res, next) => {
    Recipe.findByIdAndDelete(req.params.recipeId)
    .then(() => {
        res.redirect('/recipes');
    })
    .catch(err => {
        console.log('error deleting recipe', err);
        next();
    });
});

//READ: Recipe details
router.get('/recipes/:recipeId', (req, res, next) => {
    const id = req.params.recipeId;
  
    Recipe.findById(id)
    .then(recipe => {
        res.render('recipes/recipe-details', recipe);
    })
    .catch(err => {
        console.log('error getting recipe details from DB', err);
        next(err);
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
    

 
module.exports = router;