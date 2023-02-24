const { PrismaClient } = require("@prisma/client");
const { Strategy } = require("passport-local");
const LocalStrategy = require("passport-local").Strategy;
const { hash, compare } = require("../utils");
const passport = require("passport");
require("dotenv").config();
const session = require("express-session");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


const prisma = new PrismaClient();

//Set strategy options
const options = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

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
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          password: await hash(req.body.password),
          city: req.body.city,
          dietary_restrictions: req.body.diet,
          allergies: req.body.intolerances,
          register_date: new Date(),
        },
      });
      if (!emailExists) {
        return callback(null, user, {
          message: "Successfully created account",
          statusCode: 201,
        });
      }
    } catch (err) {
      console.error(err.message);
      return callback(null, err);
    }
  })
);

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

      if (user && validPassword) {
        return callback(null, user, {
          message: "Welcome back!",
          statusCode: 200,
        });
      }
    } catch (err) {
      console.error(err.message);
      return callback(null, err);
    }
  })
);

//Passport middleware for user profile
passport.use(
  new JwtStrategy (
      {
          secretOrKey: process.env.JWT_SECRET,
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
          //jwtFromRequest is where you get your jwt 

      },
      async (token, done) => { //this is the verify function

          console.log("in jwt strategy, token: ", token); //token is the jwt_payload, which is an object literal containing the decoded JWT payload
          //done is a passport error first callback accepting arguments done(error, user, info)

          console.log(token)

          //Don't make it though the getJwt function check. No token
          //prints unauthorized 
          
          //Invalid token: again doesn't make it into this function. Prints authorized

          // Makes it into this function but gets app error (displays erroe message. No redirecting)

          if(!token.id){
              let testError = new Error (
                  "there's no id!"
              );
              return done(testError, false);
          }
          console.log('done')
          return done(null, token);
          }
  )
)
