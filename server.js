const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/Article');
const MethodOverride = require('method-override');
const app = express();
const articlesRouter = require('./routes/articles');

// Connect to Server
mongoose.connect('mongodb://localhost/blog', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Add JSON setiings
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MethodOverride setting in order to user .delete
app.use(MethodOverride('_method'));

// Set EJS template engine
app.set('view engine', 'ejs');

app.get('/', async (req, res, next) => {
  const articles = await Article.find({}).sort({ createdAt: -1 });
  res.render('articles/index', { articles });
});

// Routes
app.use('/articles', articlesRouter);

app.listen(5000, () => {
  console.log('App listening on port 5000!');
});
