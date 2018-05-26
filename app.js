const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const seedDB = require('./seeds');
const User = require('./models/user');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

app.use(flash()); // Need Express Session & Must hapen before passport config

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'YelpCamp!',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// A middle ware for PASSING req.user --> Run automatically for all request
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// CONFIG
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, () => {
  console.log('YelpCamp has started!');
});
