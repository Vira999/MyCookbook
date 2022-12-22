const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  // TODO: write the schema
  
  title: { type: String, required: true, unique: true },
  
  ingredients: { type: Array },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
},

  
  Recipeimage: {
    type: String,
    required: false,
  },

  instructions: {type: String, required: true },

  comments: [
    {
        type :mongoose.Schema.Types.ObjectId ,
        ref:"Comment"                         //"Comments is the Model name"
    }

    ],

  
});

//recipeSchema.index({ title: 'text', ingredients: 'text'});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;