const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then(user => {
    if (user) {
      return res
        .status(400)
        .json({ username: "This username has already been taken" });
    } else {
      const newUser = new User({
        username,
        password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const payload = { name: user.name, id: user.id };
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({ success: true, token: "Bearer " + token });
                },
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then(user => {
    if (!user) {
      return res
        .status(404)
        .json({ username: "We could not find a user with that username." });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { name: user.name, id: user.id };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: `Bearer ${token}` });
          },
        );
      } else {
        return res.status(400).json({ password: "incorrect password" });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
    });
  },
);

module.exports = router;