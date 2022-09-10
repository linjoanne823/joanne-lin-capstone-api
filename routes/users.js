const express = require("express");
const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { generateToken } = require("../src/utils");
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");

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
    const token = generateToken(user.user_id);
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
    const token = generateToken(user.user_id);
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

//user auth middleware
function authorize(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    console.log("Auth Token:", token);
    const result = jwt.verify(token, process.env.JWT_SECRET);
    console.log("auth result", result);
    if (result) {
      // Decode the token to pass along to end-points that may need
      // access to data stored in the token.
      const decode = jwt.decode(token);
      console.log("decode is: ", decode);
      req.decode = decode;
      next();
    } else {
      res.status(403).json({ error: "Not Authorized." });
    }
  } else {
    res.status(403).json({ error: "No token. Unauthorized." });
  }
}

// get user profile
router.get("/", authorize, async (req, res) => {
  const user = await prisma.Users.findUnique({
    where: {
      user_id: req.decode.id,
    },
  });
  delete user.password;
  res.status(201).json(user);
});
//edit profile
router.put("/", async (req, res) => {
  const userId = req.query.userId;

  const {
    firstNameContext,
    lastNameContext,
    emailContext,
    locationContext,
    dietContext,
    allergiesContext,
  } = req.body;

  const updateUser = await prisma.Users.update({
    where: {
      user_id: parseInt(userId),
    },
    data: {
      first_name: firstNameContext,
      last_name: lastNameContext,
      email: emailContext,
      city: locationContext,
      dietary_restrictions: dietContext,
      allergies: allergiesContext,
    },
  });
  res.json(updateUser);
});

module.exports = router;
