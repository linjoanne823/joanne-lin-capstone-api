const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.use(cors());
router.use(bodyParser.json());

const apiKey = process.env.SPOONACULARKEY;

//routes

router.get("/favourites", async (req, res) => {
  const userId = req.query.userId
  //goes into Users table and include all the recipes tied to this user
  const user = await prisma.Users.findUnique({ 
    where: {
      user_id: parseInt(userId),
    },
    include: {
      recipes:true,
    },
  });

  const favouriteRecipes = user.recipes

  console.log(user)

  favouriteRecipes.forEach((element) => {
    element.ingredients = element.ingredients.split("\n");
    element.instructions = element.instructions.split("\n");
    element.image = element.photo;
    element.title = element.name;
    element.readyInMinutes = element.ready_in_minutes;
    element.isLiked = true;
  });

  res.json(favouriteRecipes);
});

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
      res.status(200).json(apiResponse.data);
    })
    .catch(() => res.status(500).send("error"));
});

router.get("/:recipeId", (req, res) => {
  const id = req.params.recipeId;
  const userId = req.query.userId;

  axios
    .get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    )
    .then(async (apiResponse) => {
      const newIngredientSet = apiResponse.data.extendedIngredients.map(
        (element) => {
          return element.original;
        }
      );

      const newInstructionSet =
        apiResponse.data.analyzedInstructions[0].steps.map((element) => {
          return element.step;
        });

      const newRecipeResponse = {
        id: id,
        title: apiResponse.data.title,
        image: apiResponse.data.image,
        readyInMinutes: apiResponse.data.readyInMinutes,
        servings: apiResponse.data.servings,
        ingredients: newIngredientSet,
        instructions: newInstructionSet,
      };

      prisma.Recipes.findUnique({
        where: {
          recipe_id: parseInt(id),
        },
        include: {
          users: true,
        },
      })
        .then((userRecipe) => {
          if (userRecipe === null) { //if the user + recipe joint table is null
            //then isLiked is false 
            newRecipeResponse.isLiked = false;
          } else {
            newRecipeResponse.isLiked = userRecipe.users.some(
              (user) => (user.user_id = userId)
            );
          }
          res.status(200).json(newRecipeResponse);
        })
        .catch((err) => {
          newRecipeResponse.isLiked = false;
          res.status(200).json(newRecipeResponse);
          console.log(err);
        });
    })
    .catch(() => res.status(500).send("error"));
});

//post - favourite recipes

router.post("/favourites", async (req, res) => {
  //   console.log(req.body);

  const userId = req.body.userId;
  const {
    id,
    title,
    image,
    readyInMinutes,
    servings,
    ingredients,
    instructions,
  } = req.body.recipeDetails; //this is from the front-end recipeDetails

  const params = {
    recipe_id: parseInt(id),
    name: title,
    ready_in_minutes: readyInMinutes.toString(),
    servings: servings.toString(),
    ingredients: ingredients.join("\n"),
    instructions: instructions.join("\n"),
    photo: image,
    users: {
      connect: {
        user_id: userId,
      },
    },
  };

  const favouriteRecipes = await prisma.Recipes.upsert({
    where: {
      recipe_id: parseInt(id),
    },
    create: params,
    update: params,
  });
  //   console.log(favouriteRecipes);
});

//delete - unfavourite recipes

router.delete("/favourites", async (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  const recipeId = req.body.recipeDetails.recipe_id;

  await prisma.Recipes.update({
    where: {
      recipe_id: parseInt(recipeId),
    },
    data: {
      users: {
        disconnect: [{ user_id: userId }],
      },
    },
    include: {
      users: true,
    },
  });
  console.log(recipeId);
});

module.exports = router;
