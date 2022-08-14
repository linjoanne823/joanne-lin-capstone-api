const { PrismaClient } = require("@prisma/client");
const { Strategy } = require("passport-local");
const LocalStrategy = require("passport-local").Strategy;
const { hash, compare } = require("../utils");
const passport = require("passport");
require("dotenv").config();
const session = require("express-session");

const prisma = new PrismaClient();

//Set strategy options
const options = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

// module.exports =
//Passport middleware for signup
passport.use(
  "signup",
  new Strategy(options, async (req, email, password, callback) => {
    try {
      //check if the user already exists
      const emailExists = await prisma.Users.findFirst({ where: { email } });
      if (emailExists) {
        return callback(null, false, {
          message: "Email already exists",
          statusCode: 400,
        });
      }

      //create the user
      const user = await prisma.Users.create({
        data: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: await hash(req.body.password),
          city: req.body.city,
        },
      });
      if(!emailExists){
          return callback(null, user,{
              message:"Successfully created account",
              statusCode:201
          })
      }
    } catch (err) {
      console.error(err.message);
      return callback(null, err);
    }
  })
);

// module.exports =
//Passport middleware for login
options.passReqToCallback = false;
passport.use(
  "login",
  new Strategy(options, async (email, password, callback) => {
    try {
      //check if user exists
      const user = await prisma.Users.findFirst({ where: { email } });
      if (!user) {
        return callback(null, false, {
          message: "No user found",
          statusCode: 400,
        });
      }
      //check password
      const validPassword = await compare(password, user.password);
      if (!validPassword) {
        return callback(null, false, {
          message: "Invalid password",
          statusCode: 401,
        });
      }

      if(user && validPassword){
          return callback(null, user,{
              message:"Welcome back!",
              statusCode:200
          })
      }
     
    } catch (err) {
      console.error(err.message);
      return callback(null, err);
    }
  })
);
