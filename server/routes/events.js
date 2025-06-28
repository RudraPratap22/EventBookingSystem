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

// Delete an event by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted', event: result.rows[0] });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new endpoint for updating tickets (MOVE THIS BEFORE THE GENERAL PUT ROUTE)
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

// Update event details (do not reset remaining_tickets unless explicitly provided)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title, description, date, price, location, category, image_url, total_tickets
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, date = $3, price = $4, location = $5,
           category = $6, image_url = $7, total_tickets = $8
       WHERE id = $9
       RETURNING *`,
      [title, description, date, price, location, category, image_url, total_tickets, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete events with dummy image URLs
router.delete('/cleanup-dummy-images', async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM events 
      WHERE image_url IS NULL 
      OR image_url = '' 
      OR image_url = 'addd' 
      OR image_url NOT LIKE 'http%'
      RETURNING id, title
    `);
    
    res.json({ 
      message: `Deleted ${result.rows.length} events with invalid image URLs`,
      deletedEvents: result.rows 
    });
  } catch (error) {
    console.error('Error cleaning up events:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;