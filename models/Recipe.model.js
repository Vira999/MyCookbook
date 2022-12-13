const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://Vira:01122022@cluster0.6qjfiiw.mongodb.net/MyCookbook?retryWrites=true&w=majority')
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
    type: String,
    required: false,
  },

  instructions: {type: String, required: true },

  comments: [
    {
        type :mongoose.Schema.Types.ObjectId ,
        ref:"Comments"                         //"Comments is the Model name"
    }

    ],

  
});

recipeSchema.index({ title: 'text', ingredients: 'text'});


module.exports = mongoose.model('Recipe', recipeSchema);

