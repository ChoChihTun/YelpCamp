const express = require('express');

const router = express.Router();
const Campground = require('../models/campground');

// ================
// Campground Routes
// ================

// INDEX
/* Using /campgrounds for get and post for RESTful */
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: campgrounds });
    }
  });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  };

  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
      res.redirect('/campgrounds');
    }
  });
});

// NEW
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW
router.get('/:id', (req, res) => {
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

// EDIT

// UPDATE

function isLoggedIn(req, res, next) {
  // if is logged in, we will move to next param in the get request
  if (req.isAuthenticated()) {
    return next();
  }
  // if not loggin, go to login page
  return res.redirect('/login');
}

module.exports = router;
