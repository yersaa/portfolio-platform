// middlewares/authorization.js

// Middleware to check if the user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Middleware to check if the user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  next();
}

// Middleware to check if 2FA is verified
function checkTwoFactorAuthenticated(req, res, next) {
  // Ensure the user is authenticated
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/login');
  }

  // Check if user exists
  if (!req.user) {
    return res.redirect('/login');
  }

  // Check if twoFactorSecret is set up
  if (!req.user.twoFactorSecret) {
    return res.redirect('/2fa/setup');
  }

  // Check if 2FA has been verified in the session
  if (req.session.twoFactorAuthenticated) {
    return next();
  }

  // Redirect to 2FA verification
  res.redirect('/2fa/verify');
}

// Middleware to check if user is an admin
function checkAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).render('error', {
    message: 'Access denied: Admins only.',
  });
}

// Middleware to check if user is an editor
function checkEditor(req, res, next) {
  if (
    req.isAuthenticated &&
    req.isAuthenticated() &&
    (req.user.role === 'editor' || req.user.role === 'admin')
  ) {
    return next();
  }
  res.status(403).render('error', {
    message: 'Access denied: Editors only.',
  });
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin,
  checkEditor,
};
