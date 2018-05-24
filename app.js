const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const User = require('./models/user');

const app = express();

mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

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

// CONFIG
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

// ================
// Campground Routes
// ================

// INDEX
/* Using /campgrounds for get and post for RESTful */
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds });
    }
  });
});

// CREATE
app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newCampground = {
    name: name,
    image: image,
    description: description,
  };

  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
    }

    res.redirect('/campgrounds');
  });
});

// NEW
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW
app.get('/campgrounds/:id', (req, res) => {
  // find campground with the provided id
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

// ================
// Comment Routes
// ================

// NEW
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// CREATE
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      });
    }
  });
});

// ===============
// AUTH ROUTES
// ===============

// Show register form
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle sign up logic
app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Handling login logic
app.post('/login', passport.authenticate('local', { // middleware: codes that we run before the callback function
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), (req, res) => {
  console.log('test');
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(); // Destroying user data in this session
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  // if is logged in, we will move to next param in the get request
  if (req.isAuthenticated()) {
    return next();
  }
  // if not loggin, go to login page
  res.redirect('/login');
}

app.listen(3000, () => {
  console.log('YelpCamp has started!');
});
