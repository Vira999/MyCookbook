const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const commentSchema = new Schema(
{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
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