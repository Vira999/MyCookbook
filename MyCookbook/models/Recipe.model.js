const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const data = require('.db/index')

mongoose.connect('mongodb://localhost/MyCookbook')
  .then(() => {
    console.log('Connected to Mongo!')
    mongoose.connection.db.dropDatabase();
    createRecipe()
    .then((recipe) => { 
      console.log('The recipe is saved and its value is: ', recipe) 
      insertMany()
    .then((recipes) => { 
        console.log('The recipe is saved and its value is: ', recipes) 
        updateRecipe()
    .then((recipe) => { 
         console.log('Update the recipe')
          removeRecipe()
    .then((recipe) => { 
            console.log('Removed the recipe')
            mongoose.connection.close();
          })
    .catch((err) => { console.log('An error happened:', err) })
        })
      })
    })
    .catch((err) => { console.log('An error happened:', err) });
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });


const recipeSchema = new Schema({
  // TODO: write the schema
  
  title: { type: String, required: true, unique: true },
  
  ingredients: { type: Array },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
},

  createdDate: { type: Date, default: Date.now },
  
  image: {
    type: Image,
    required: false,
  },

  recipe: {type: String, required: true },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
        username: String,           
        comment: String,          
        date: {
            type: Date,
            default: Date.now
        },           
        rating: Number,
    },{
        timestamps: true
    }],

  
});

recipeSchema.index({ title: 'text', ingredients: 'text'});


module.exports = mongoose.model('Recipe', recipeSchema);

