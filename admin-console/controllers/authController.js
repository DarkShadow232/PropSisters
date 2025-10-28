const Admin = require('../models/Admin');

// GET /auth/login - Show login page
exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Admin Login',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// POST /auth/login - Handle login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      req.flash('error', 'Please provide email and password');
      return res.redirect('/auth/login');
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    // Create session
    req.session.adminId = admin._id;
    req.session.adminEmail = admin.email;
    req.session.adminName = admin.name;

    req.flash('success', 'Welcome back, ' + admin.name + '!');
    
    // Redirect to return URL or dashboard
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login');
    res.redirect('/auth/login');
  }
};

// GET /auth/logout - Handle logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};

