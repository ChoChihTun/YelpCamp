const express = require('express');

const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ================
// Comment Routes
// ================

// NEW
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (commentErr, comment) => {
        if (commentErr) {
          console.log(commentErr);
        } else {
          // req.user is valid because we ran isLoggedIn and we know user must be present
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  // if is logged in, we will move to next param in the get request
  if (req.isAuthenticated()) {
    return next();
  }
  // if not loggin, go to login page
  return res.redirect('/login');
}

module.exports = router;