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

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;

