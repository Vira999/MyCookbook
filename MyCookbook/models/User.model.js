const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName:{
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffavpng.com%2Fpng_view%2Favatar-user-profile-avatar-png%2F1LbmB6ng&psig=AOvVaw3rytoHJv-ShBxQJN88QPaS&ust=1669838369253000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMiGh-qW1PsCFQAAAAAdAAAAABAD'
    },
    userBio: {
      type: String,
      required: false,
    },
    userRecipes: {
      recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
