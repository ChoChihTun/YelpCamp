// All the middle ware goes here
const middlewareObj = {};

const Campground = require('../models/campground');
const Comment = require('../models/comment');

middlewareObj.isLoggedIn = (req, res, next) => {
  // if is logged in, we will move to next param in the get request
  if (req.isAuthenticated()) {
    return next();
  }
  // if not loggin, go to login page
  return res.redirect('/login');
};

// Middle ware for campground authorization
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect('back'); // redirect back to where user comes from

        // Checks if user owns campground
      } else if (foundCampground.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
};

// Middle ware for commnet authorization
middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back'); // redirect back to where user comes from

        // Checks if user owns comment
      } else if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
};

module.exports = middlewareObj;
