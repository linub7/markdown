const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

// @desc Add New Article
// @route GET /articles/new
router.get('/new', (req, res, next) => {
  res.render('articles/new', { article: new Article() });
});

// @desc  Show Edit Specific Article
// @route GET /edit/:id
router.get('/edit/:id', async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  res.render('articles/edit', { article });
});

// @desc Post Article
// @route /articles
router.post(
  '/',
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect('new')
);

// @desc  Specific article Page
// @route GET /articles/:id
router.get('/:slug', async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect('/');
  res.render('articles/show', { article });
});

// @desc update specific article
// @route PUT /article/:id
router.put(
  '/:id',
  async (req, res, next) => {
    req.article = await Article.findByIdAndUpdate(req.params.id);
    next();
  },
  saveArticleAndRedirect('edit')
);

// @desc  Delete Specific Article
// @route DELETE /articles/:id
router.delete('/:id', async (req, res, next) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      console.log(err);
      res.render(`articles/${path}`, { article });
    }
  };
}

module.exports = router;
