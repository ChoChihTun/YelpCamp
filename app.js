const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');

const Campground = require('./models/campground');

// CONFIG
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX
/* Using /campgrounds for get and post for RESTful */
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: campgrounds });
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
  res.render('new');
});

// SHOW
app.get('/campgrounds/:id', (req, res) => {
  // find campground with the provided id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render('show', { campground: foundCampground });
    }
  });
});

app.listen(3000, () => {
  console.log('YelpCamp has started!');
});
