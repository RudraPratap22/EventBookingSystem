const pool = require('../config/db');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { email, name, profilePicture } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, name, profile_picture) VALUES ($1, $2, $3) RETURNING *',
      [email, name, profilePicture]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};
