const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

router.use(cors());
router.use(bodyParser.json());

const apiKey = process.env.SPOONACULARKEY;

//routes

router.get("/", (req, res) => {
  const { diet, intolerances, cuisine } = req.query;
  axios
    .get(
      `https://api.spoonacular.com/recipes/complexSearch/?apiKey=${apiKey}`,
      {
        params: {
          diet: diet,
          intolerances: intolerances,
          cuisine: cuisine,
        },
      }
    )
    .then((apiResponse) => {
      console.log(apiResponse.data);
      res.status(200).json(apiResponse.data);
    })
    .catch(() => res.status(500).send("error"));
});

router.get("/:recipeId", (req, res) => {
  const id = req.params.recipeId;

  axios
    .get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    )
    .then((apiResponse) => {
      console.log(apiResponse.data);
      res.status(200).json(apiResponse.data);
    })
    .catch(() => res.status(500).send("error"));
});

module.exports = router;
