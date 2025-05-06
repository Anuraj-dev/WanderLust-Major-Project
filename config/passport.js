const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../Models/user");

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_HOST}/auth/google/callback`,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo", // Add this line to ensure we get the profile data
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Google profile:", JSON.stringify(profile, null, 2));
        console.log("New user registered!");

        // Find user by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Extract email more safely
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        // Create username from display name or email
        const username = profile.displayName || email.split("@")[0];

        // Check if user exists with this email
        user = await User.findOne({ email });

        if (user) {
          // Update existing user with googleId
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user for OAuth - no password needed
        const newUser = new User({
          username,
          email,
          googleId: profile.id,
        });

        // Save the user first
        await newUser.save();

        // Manually set the user as authenticated without password
        // This ensures the user can log in with OAuth but not with password
        return done(null, newUser);
      } catch (err) {
        console.error("Google auth error:", err); // Debug log
        return done(err, null);
      }
    }
  )
);

// Configure GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_HOST}/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by githubId
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        // If user not found, create a new user
        const email = profile.emails && profile.emails[0].value;
        if (!email) {
          return done(new Error("Email not available from GitHub"));
        }

        const username = profile.displayName || email.split("@")[0];

        // Check if user exists with this email
        user = await User.findOne({ email });

        if (user) {
          // Update existing user with githubId
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user for OAuth - no password needed
        const newUser = new User({
          username,
          email,
          githubId: profile.id,
        });

        // Save the user first
        await newUser.save();

        // Manually set the user as authenticated without password
        // This ensures the user can log in with OAuth but not with password
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
