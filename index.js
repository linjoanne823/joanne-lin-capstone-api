const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");

const recipesRoute = require("./routes/recipes");
const restaurantsRoute = require("./routes/restaurants");
const usersRoute = require("./routes/users");

const users = [];

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(flash());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/recipes", recipesRoute);
app.use("/restaurants", restaurantsRoute);
app.use("/users", usersRoute);

//health check endpoint for load balancer 
//to balance traffic
app.all("/health", (req, res) => {
  res.send(200);
});

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

app.listen(PORT, () => {
  console.log(`server listening on Port ${PORT}`);
});
