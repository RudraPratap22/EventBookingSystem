const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db'); // Import your database pool

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const profilePicture = profile.photos[0].value;
        const provider = 'google';
        const providerId = profile.id;

        // Check if user exists in the database
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        // Insert new user into the database
        const newUser = await pool.query(
          'INSERT INTO users (email, name, profile_picture, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [email, name, profilePicture, provider, providerId]
        );
        done(null, newUser.rows[0]);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
