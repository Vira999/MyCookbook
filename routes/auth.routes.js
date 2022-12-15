const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = require("express").Router();

const User = require('../models/User.model');

const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');

/* GET Signup page */
router.get("/signup", (req, res) => {
  const loggedInNavigation = req.session.hasOwnProperty('currentUser');
  res.render("auth/signup", {loggedInNavigation});
});

/* POST Signup page */
router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  if(!firstName || !lastName || !username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory to become a Chef in our community' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  User
  .create({ firstName, lastName, username, email, password: passwordHash, profileImage: 'images/chef-hat-red.png', userBio: '', userRecipes: '' })
  .then((newUser) => {
    res.redirect('/auth/login')
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
    res.status(500).render('auth/signup', {
       errorMessage: 'Username and email need to be unique. Either username or email is already used.'
       })
    }
  else {
    next(error);
    }
  })
});

/* GET User Profile page */
router.get("/profile", isLoggedIn, (req, res, next) => {

  console.log(req.session);
  const { currentUser } = req.session
  
  if(currentUser){
    const currentUserId = req.session?.currentUser?._id;

    User
    .findById(currentUserId)
    .populate("userRecipes")
    .populate({
      path: 'userRecipes',
      populate: {
        path: "recipe",
        populate: {
          path: "title image",
          model: "Recipe",
        }
      }
    })
    .then((user) => {
      res.render("user-profile", { user })
    })
  }
  else {
      res.redirect('/auth/login')
  }
  
});

/* GET Login page */
router.get("/login", isLoggedOut, (req, res) => {
  console.log(req.session)
  res.render("auth/login");
});

/* POST Login page */
router.post("/login", isLoggedOut, (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please log-in with your email and password'
      });
      return;
  }
  
 User
 .findOne({ email })
 .then(user => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'Incorrect credentials' });
    } else if (bcrypt.compareSync(password, user.password)) {
      res.render('user-profile', { user })
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect credentials' });
    }
  })
  .catch(error => next(error));
});

/* POST Logout page */
router.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
});

module.exports = router;