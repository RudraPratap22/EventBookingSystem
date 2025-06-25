const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const passport = require('./config/passport');
const session = require('express-session');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const bodyParser = require('body-parser');
const bookingsRouter = require('./routes/bookings');

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
}));

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found. Please check the endpoint.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});