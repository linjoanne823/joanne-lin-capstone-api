const express = require("express");
const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { generateToken } = require("../src/utils");
const passport = require("passport");
const session = require("express-session");

const { PrismaClient } = require("@prisma/client");
require("../src/passport/local");

const prisma = new PrismaClient();

router.use(cors());
router.use(bodyParser.json());

//user signup
router.post("/signup", (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    //check for errors
    if (err) throw new Error(err);

    const { message } = info;
    const statusCode = info.statusCode || 403;

    //generate token
    const token = generateToken(user.id);
    return res.status(statusCode).json({
      data: {
        message,
        user,
        token,
      },
      statusCode: res.statusCode,
    });
  })(req, res, next);
});

//user login
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    //check for errors
    if (err) throw new Error(err);

    const { message } = info;
    const statusCode = info.statusCode || 403;

    //generate token
    const token = generateToken(user.id);
    return res.status(statusCode).json({
      data: {
        message,
        user,
        token,
      },
      statusCode,
    });
  })(req, res, next);
});
//edit profile
router.put("/", async (req, res) => {
  const userId = req.body.userId;

  const {
    firstNameContext,
    lastNameContext,
    emailContext,
    // password,
    locationContext,
    dietContext,
    allergiesContext,
  } = req.body;

  const updateUser = await prisma.Users.update({
    where: {
      user_id: userId,
    },
    data: {
      first_name: firstNameContext,
      last_name: lastNameContext,
      email: emailContext,
    //   password: password,
      city: locationContext,
      dietary_restrictions: dietContext,
      allergies: allergiesContext,
    },
  });
  res.json(updateUser);
});

module.exports = router;
