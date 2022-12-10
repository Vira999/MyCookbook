const express = require('express');
const router = express.Router();

const { isLoggedIn, isOwner } = require('../middleware/')//add file where located
const fileUploader = require("../config/cloudinary.config");

const recipe = require('../models/Recipe.model');
const comment = require('../models/Comments.model'); 
const data = require('.db/index'); // maybe dont need

 
// GET route to retrieve and display all the recipes
router.get('/', isLoggedIn, (req, res) => {
  res.render('recipe/index');
});


router.get('/search', isLoggedIn,  (req, res) => {
        const { recipeName } = req.query;

        recipe.findOne({title: recipeName})
            .then(foundByRecipe => {
                res.render('../views/recipe-detail.hbs', {singleRecipe: foundByRecipe})
            })
            .catch(err => console.log(err))
})

router.get('/create', isLoggedIn, (req, res) => {
    res.render('../views/recipe.hbs')
})

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
        .then(() => res.redirect('../views/recipe.hbs'))
        .catch(err => console.log(err))
})
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
   
    recipe.findById(recipeId)
        .then(recipeFound => {
            console.log('recipeFound', recipeFound)
            res.render('../views/recipe.hbs', {singleRecipe: recipeFound})
        })
        .catch(err => console.log(err))
})

//DELETE FROM EDIT PAGE
router.post('/recipes/:recipeId/delete', isLoggedIn, (req, res, next) => {
    Recipe.findByIdAndDelete(req.params.recipeId)
    .then(() => {
        res.redirect('/recipes');
    })
    .catch(err => {
        console.log('error deleting', err);
        next();
    });
});

router.get('/comments/:id', (req, res) => {
 
    Comment.findById(req.params.id).then(comment => {
     
      Comment.find({ commentId: req.params.id }).then(comments => {
       
        res.render('comments-show', { comments: comments })
      })
    }).catch((err) => {
      // catch errors
      console.log(err.message)
    });
  });
 
    

 
module.exports = router;