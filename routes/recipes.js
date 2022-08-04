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
  console.log(req.query);
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

const favouriteRecipes = [
  {
    title: "Berry Banana Breakfast Smoothie",
    image: "https://spoonacular.com/recipeImages/715497-312x231.jpg",
    readyInMinutes: "5",
    servings: "1",
    ingredients: "many ingredients",
    instructions: "many instructions",
  },
  {
    title: "Slow Cooker Red Beans and Rice",
    image: "https://spoonacular.com/recipeImages/715493-556x370.jpg",
    readyInMinutes: "20",
    servings: "2",
    ingredients: "many ingredients",
    instructions: "many instructions",
  },
];

router.get("/favourites/recipes", (req, res) => {
  const favouriteRecipe = favouriteRecipes.map((element) => {
    return {
      title: element.title,
      image: element.image,
      readyInMinutes: element.readyInMinutes,
      servings: element.servings,
      ingredients: element.ingredients,
      instructions: element.instructions,
    };
  });
  res.json(favouriteRecipe);
});

module.exports = router;
