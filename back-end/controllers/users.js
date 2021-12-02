const JWT = require("jsonwebtoken");
const express = require("express");

const { User } = require("../models/users");

// setting up the token (payload)
signToken = (user) => {
  return JWT.sign(
    {
      iss: "DYOR",
      sub: user.id,
      iat: new Date().getTime(),
    },
    process.env.JWT_SECRET,
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    console.log("IN SIGNUP");
    const { email, password } = req.value.body;
    console.log(email, password);
    // checking if the user is alredy created with the given email
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(403)
        .json({ success: false, error: "email is already in use" });
    }

    // creating a new user
    const newUser = new User({ email, password });
    await newUser.save();

    // responding with the webtoken
    const token = signToken(newUser);

    res.status(200).json({ success: true, email: newUser.email, token: token });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res
      .status(200)
      .json({ success: true, email: req.user.email, token: token });
  },

  secret: async (req, res, next) => {
    res.status(200).json({ success: true });
  },
};
