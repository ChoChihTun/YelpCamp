const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const campgrounds = [
  {
    name: 'Salmon Creek',
    image:
      'https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b0144393f9c57baeeab7_340.jpg',
  },
  { name: 'Granite Hill', image: 'https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg' },
  {
    name: "Mountain Goat's Rest",
    image:
      'https://pixabay.com/get/ea36b80c2df4033ed1584d05fb1d4e97e07ee3d21cac104497f6c87da5e4b2ba_340.jpg',
  },
];

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

/* Using /campgrounds for get and post for RESTful */
app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const newCampground = { name: name, image: image };

  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.listen(3000, () => {
  console.log('YelpCamp has started!');
});
