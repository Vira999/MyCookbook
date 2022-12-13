const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
      store: new MongoStore({
        mongoUrl: 'mongodb+srv://Mironhack2:13122022@cluster0.rwzn1qh.mongodb.net/MyCookbook?retryWrites=true&w=majority',
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day      
      })
    })
  );
};
