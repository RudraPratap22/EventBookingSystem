const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await pool.query(`
      SELECT 
        id, 
        title, 
        description,
        date,
        TO_CHAR(date, 'Mon DD, YYYY') as formatted_date, 
        price::numeric::float8, 
        location as venue,
        category,
        image_url as image,
        total_tickets,
        remaining_tickets as "availableTickets"
      FROM events
      ORDER BY date ASC
    `);
    res.json(events.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// New POST endpoint to add events
router.post('/', async (req, res) => {
  const { title, description, date, price, location, category, image_url, total_tickets } = req.body;
  try {
    const newEvent = await pool.query(`
      INSERT INTO events (title, description, date, price, location, category, image_url, total_tickets, remaining_tickets)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING *
    `, [title, description, date, price, location, category, image_url, total_tickets]);
    res.json(newEvent.rows[0]);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update tickets after purchase
router.post('/update-tickets', async (req, res) => {
  const { eventId, ticketsPurchased } = req.body;
  try {
    const result = await pool.query(
      'UPDATE events SET available_tickets = available_tickets - $1 WHERE id = $2 AND available_tickets >= $1 RETURNING *',
      [ticketsPurchased, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or insufficient tickets' });
    }

    res.status(200).json({ 
      message: 'Tickets updated successfully', 
      event: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new endpoint for updating tickets
router.put('/update-tickets/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid ticket quantity' });
    }

    const result = await pool.query(
      `
      UPDATE events 
      SET remaining_tickets = remaining_tickets - $1
      WHERE id = $2 AND remaining_tickets >= $1
      RETURNING *
      `,
      [quantity, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Not enough tickets available or event not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tickets:', error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;