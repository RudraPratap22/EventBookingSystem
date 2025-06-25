const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      console.error('Google authentication failed:', err);
      return res.redirect('/auth/failure');
    }
    // Generate JWT token with profile picture and name
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture || null, // Ensure profilePicture is included
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect to the frontend main page with the token as a query parameter
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Replace with your actual frontend URL
    res.redirect(`${frontendUrl}/?token=${token}`);
  })(req, res, next);
};

exports.authSuccess = (req, res) => {
  const token = req.query.token;
  res.status(200).json({ message: 'Authentication successful', token });
};

exports.authFailure = (req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login request received:', { email, password });
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      console.error('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const userPassword = user.rows[0].password;
    console.log('Retrieved user password:', userPassword);
    if (!userPassword) {
      console.error('Password is missing for user:', email);
      return res.status(401).json({ message: 'This account is registered using Google. Please use Google login.' });
    }
    const validPassword = await bcrypt.compare(password, userPassword);
    if (!validPassword) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        profilePicture: user.rows[0].profile_picture || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('User logged in successfully:', email);
    res.status(200).json({ message: 'Login successful', token, user: { name: user.rows[0].name, profilePicture: user.rows[0].profile_picture } });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in user' });
  }
};