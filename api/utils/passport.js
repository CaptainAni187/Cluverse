import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5001/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Defensive: get email and name
    const email = profile.emails?.[0]?.value;
    let name = profile.displayName;
    if (!name && email) name = email.split('@')[0];
    if (!name) name = 'Google User';

    // Try to find by googleId first
    let user = await User.findOne({ googleId: profile.id });

    // If not found, try by email (link Google to existing account)
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = profile.id;
        user.profilePic = profile.photos?.[0]?.value;
        await user.save();
      }
    }

    // If still not found, create a new user
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name,
        email,
        role: 'student', // You can infer role by domain if needed
        profilePic: profile.photos?.[0]?.value,
        approved: true // Google users are auto-approved as students
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
