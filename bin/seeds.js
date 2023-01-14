const mongoose = require("mongoose");

const User = require("../models/User.model");

const DB_NAME = "MyCookbook";

mongoose.connect(`mongodb://localhost/${DB_NAME}`);

const users = [
    {
        firstName: "Dabiz",
          lastName: "Muñoz",
          username: "ChefXO",
          email: "xo@chef.com",
          password: "1234",
          profileImage: '../public/images/chef-hat-red.png',
          userBio: "Spanish crazy Chef",
          userRecipes: [],
    },
    {
        firstName: "Gordon",
          lastName: "Ramsay",
          username: "IdiotSandwich",
          email: "GR@chef.com",
          password: "1234",
          profileImage: '../public/images/chef-hat-red.png',
          userBio: "British crazy Chef",
          userRecipes: [],
    },
    {
        firstName: "Joël",
          lastName: "Robuchon",
          username: "MonsieurChef",
          email: "Robu@chef.com",
          password: "1234",
          profileImage: '../public/images/chef-hat-red.png',
          userBio: "French crazy Chef",
          userRecipes: [],
    },
];

User.create(users)
.then((usersFromDB) => {
    console.log(`Created ${usersFromDB.length} users`);
    mongoose.connection.close();
})