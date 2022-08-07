const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const recipesRoute = require("./routes/recipes");
const restaurantsRoute = require("./routes/restaurants");
const usersRoute = require("./routes/users");

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/recipes", recipesRoute);
app.use("/restaurants", restaurantsRoute);
app.use("/users", usersRoute);

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

app.listen(PORT, () => {
  console.log(`server listening on Port ${PORT}`);
});
