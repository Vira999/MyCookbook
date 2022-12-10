const express = require('express');
const recipe = require('../models/Recipe.model');
const router = express.Router();
const comment = require('../models/Comments.model'); 
const data = require('.db/index'); // maybe dont need

 
// GET route to retrieve and display all the recipes
router.get('/', (req, res) => {
    
    Recipe.find()
        .then(dbRecipes => { //choose name on db folder
            res.render('../recipe.hbs', { recipes: dbRecipes })
        })
        .catch(err => console.log(err))
});


router.get('/search', (req, res) => {
        const { recipeName } = req.query;

        Recipe.findOne({title: RecipeName})
            .then(foundRecipe => {
                res.render('../views/recipe.hbs', {singleRecipe: foundBrecipe})
            })
            .catch(err => console.log(err))
})

router.get('/create', (req, res) => {
    res.render('../views/recipe.hbs')
})

router.post('/create', (req, res) => {
    console.log(req.body)
    const { title,
         time,
        date,
        creator,
        image,
        ingredients,
        instruction} = req.body;
    
   Recipe.create({ 
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

router.get('/:recipeId', (req, res) => {
    const { recipeId } = req.params;
   
    Recipe.findById(recipeId)
        .then(recipeFound => {
            console.log('recipeFound', recipeFound)
            res.render('../views/recipe.hbs', {singleRecipe: recipeFound})
        })
        .catch(err => console.log(err))
})

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