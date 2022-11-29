const { Schema, model } = require("mongoose");

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
    date: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
},
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;