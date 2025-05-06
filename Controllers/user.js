const User = require("../Models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    // First check if user already exists with this username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash(
        "error",
        "Username already exists. Please choose a different username."
      );
      return res.redirect("/signup");
    }

    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    console.log("New User Registered!");

    //Auto login user
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  let { username } = req.body;
  req.flash("success", `Welcome back ${username}!`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

// Handler for OAuth callback - simplified without multiple redirects
module.exports.afterOAuth = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Authentication failed");
    return res.redirect("/login");
  }

  req.flash("success", "Welcome to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
