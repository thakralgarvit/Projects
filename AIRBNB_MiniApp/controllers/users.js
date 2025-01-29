const User = require("../models/user.js");

module.exports.signUpUser = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "user registed successfully");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.logInUser = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLogInUser = async (req, res) => {
  req.flash("success", "welcome to wander Lust u are loged in");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      nect(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listing");
  });
};
