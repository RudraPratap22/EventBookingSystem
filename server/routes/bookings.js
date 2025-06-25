const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await pool.query(`
      SELECT 
        bookings.id, 
        events.title as event, 
        users.name as customer, 
        bookings.date, 
        bookings.tickets, 
        bookings.status
      FROM bookings
      JOIN events ON bookings.event_id = events.id
      JOIN users ON bookings.user_id = users.id
      ORDER BY bookings.date ASC
    `);
    res.json(bookings.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve booking
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;