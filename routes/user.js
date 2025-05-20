const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerdUser = await User.register(newUser, password);
      console.log(registerdUser);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

router.post("/login",
    passport.authenticate("local", {
        failureRedirect : '/login',
        failureFlash: true,
    }) ,
    async (req,res) => {
        req.flash("success", "Welcome back to Wanderlust")
        res.redirect("/listings")
    }
)





// Chatgpt new code for upper code

// router.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//       if (err) return next(err);
//       if (!user) {
//         req.flash("error", "Invalid username or password");
//         return res.redirect("/login");
//       }
//       req.logIn(user, (err) => {
//         if (err) return next(err);
//         req.flash("success", "Welcome back to Wanderlust!");
//         return res.redirect("/listings");
//       });
//     })(req, res, next);
//   });
  

module.exports = router;
