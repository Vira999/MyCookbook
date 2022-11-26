const { Schema, model } = require("mongoose");

const userSchema = new Schema(
{
    userId: {
        //references user model
     },
    recipeId: {
        //references recipe model
    },
    commentText: {
        type: String,
        required: true,
    },
}
)