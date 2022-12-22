const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const commentSchema = new Schema(
{
    username: {
        author: { type: Schema.Types.ObjectId, ref: 'User' },
     },
    recipeId: {
        recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
    },
    comment: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
},
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;