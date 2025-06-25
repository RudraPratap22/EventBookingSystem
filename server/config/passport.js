const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db'); // Assuming you're using `pool` for PostgreSQL queries

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos, provider } = profile;
        const email = emails[0].value;
        const profilePicture = photos[0].value; // Extract profile picture URL

        console.log('Google profile:', profile);

        // Check if the user already exists in the database
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
          // User already exists, update the provider and provider_id
          const updatedUser = await pool.query(
            'UPDATE users SET provider = $1, provider_id = $2 WHERE email = $3 RETURNING *',
            [provider, id, email]
          );
          return done(null, updatedUser.rows[0]);
        } else {
          // User does not exist, create a new user
          const newUser = await pool.query(
            'INSERT INTO users (google_id, name, email, profile_picture, provider, provider_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, displayName, email, profilePicture, provider, id]
          );
          console.log('New user created:', newUser.rows[0]);
          return done(null, newUser.rows[0]);
        }
      } catch (err) {
        console.error('Error in GoogleStrategy:', err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;