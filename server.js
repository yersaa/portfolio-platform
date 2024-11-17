// server.js

require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
//const helmet = require('helmet');


const initializePassport = require('./config/passport-config');
initializePassport(passport);


if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(helmet());
app.use(morgan('dev'));
app.use(methodOverride('_method'));


app.use(
  session({
    secret: process.env.SECRET_KEY || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));


const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');
const stocksRoutes = require('./routes/stocks');
const analyticsRoutes = require('./routes/analytics');
const marketTrendsRoutes = require('./routes/marketTrends');
const visualizationRoutes = require('./routes/visualization');


app.use('/', authRoutes);
app.use('/', portfolioRoutes);
app.use('/', adminRoutes);
app.use('/', newsRoutes);
app.use('/', stocksRoutes);
app.use('/', analyticsRoutes);
app.use('/', marketTrendsRoutes);
app.use('/', visualizationRoutes);

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});


app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found.' });
});
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
