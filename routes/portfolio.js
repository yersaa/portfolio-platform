

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PortfolioItem = require('../models/PortfolioItem');
const {
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin,
  checkEditor,
} = require('../middlewares/authorization');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


router.get(
  '/portfolio',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  async (req, res) => {
    try {
      const items = await PortfolioItem.find().populate('createdBy');
      res.render('portfolio', { items, user: req.user });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Error fetching portfolio items.' });
    }
  }
);


router.get(
  '/portfolio/create',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkEditor,
  (req, res) => {
    res.render('createPortfolioItem');
  }
);


router.post(
  '/portfolio/create',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkEditor,
  upload.array('images', 3),
  async (req, res) => {
    const { title, description } = req.body;
    const imagePaths = req.files.map((file) => '/uploads/' + file.filename);

    try {
      const newItem = new PortfolioItem({
        title,
        description,
        images: imagePaths,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });

      await newItem.save();

      res.redirect('/portfolio');
    } catch (err) {
      console.error(err);
      res.redirect('/portfolio/create');
    }
  }
);


router.get(
  '/portfolio/:id',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  async (req, res) => {
    try {
      const item = await PortfolioItem.findById(req.params.id).populate('createdBy');
      if (!item) {
        return res.status(404).render('error', { message: 'Portfolio item not found.' });
      }
      res.render('portfolioItem', { item, user: req.user });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Error fetching portfolio item.' });
    }
  }
);


router.get(
  '/portfolio/:id/edit',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkEditor,
  async (req, res) => {
    try {
      const item = await PortfolioItem.findById(req.params.id);
      if (!item) {
        return res.status(404).render('error', { message: 'Portfolio item not found.' });
      }
      
      if (
        item.createdBy.toString() === req.user._id.toString() ||
        req.user.role === 'admin'
      ) {
        return res.render('editPortfolioItem', { item });
      }
      res.status(403).render('error', {
        message: 'Access denied: You cannot edit this item.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Error fetching portfolio item.' });
    }
  }
);


router.post(
  '/portfolio/:id/edit',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkEditor,
  upload.array('images', 3),
  async (req, res) => {
    try {
      const item = await PortfolioItem.findById(req.params.id);
      if (
        item.createdBy.toString() === req.user._id.toString() ||
        req.user.role === 'admin'
      ) {
        const { title, description } = req.body;
        let imagePaths = item.images;

        if (req.files && req.files.length > 0) {
          imagePaths = req.files.map((file) => '/uploads/' + file.filename);
        }

        await PortfolioItem.findByIdAndUpdate(req.params.id, {
          title,
          description,
          images: imagePaths,
          updatedBy: req.user._id,
        });

        res.redirect('/portfolio');
      } else {
        res.status(403).render('error', {
          message: 'Access denied: You cannot edit this item.',
        });
      }
    } catch (err) {
      console.error(err);
      res.redirect(`/portfolio/${req.params.id}/edit`);
    }
  }
);


router.post(
  '/portfolio/:id/delete',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin, 
  async (req, res) => {
    try {
      await PortfolioItem.findByIdAndDelete(req.params.id);
      res.redirect('/portfolio');
    } catch (err) {
      console.error(err);
      res.redirect('/portfolio');
    }
  }
);

module.exports = router;
