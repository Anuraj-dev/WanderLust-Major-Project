if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

// Trust the reverse proxy (Render/Railway/Heroku/Nginx, etc.) in production so
// Express reads X-Forwarded-Proto and treats TLS-terminated requests as secure.
// Without this, the `secure: true` session cookie is never sent and logins
// never persist behind a proxy.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

// Import routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");
const staticRouter = require("./routes/static.js");

// Setup app
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const dbUrl = process.env.MONGODB_URL || process.env.ATLASDB_URL;
const db = "wanderlust";

const SECRET = process.env.SECRET;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  dbName: db,
  // NOTE: connect-mongo `crypto` is intentionally disabled. It was encrypting
  // sessions into blobs that failed to decrypt/parse on the next request
  // ("Unexpected token 'M', \"MIIC...\" is not valid JSON"), 500-ing every route.
  // The session cookie is already signed (secret) + httpOnly + secure, so
  // DB-level encryption added only fragility.
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("Error in MONGO SESSION STORE", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled DB connection error:", err.message);
});

const sessionOptions = {
  store,
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
passport.use(new LocalStrategy(User.authenticate()));
// Load OAuth strategies
require("./config/passport");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl, { dbName: db });
}

// Root path
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((req, res, next) => {
  // Guard against a broken/unavailable session: req.flash throws if the session
  // failed to load, which previously skipped these locals and cascaded into
  // "success is not defined" / "currUser is not defined" template crashes.
  try {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
  } catch (e) {
    res.locals.success = [];
    res.locals.error = [];
  }
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", searchRouter); // Add the search routes
app.use("/", staticRouter); // Add the static routes

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found!!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!!" } = err;
  res.status(status).render("error.ejs", { message });
});

if (require.main === module) {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
  });
}

module.exports = app;
