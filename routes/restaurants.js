const express = require("express");
const router = express.Router();
const yelpApiUrl = "https://api.yelp.com/v3/graphql";
const { GraphQLClient } = require("graphql-request");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const bodyParser = require("body-parser");
const cors = require("cors");
const { argsToArgsConfig } = require("graphql/type/definition");
router.use(cors());
router.use(bodyParser.json());

const client = new GraphQLClient(yelpApiUrl, {
  headers: { Authorization: `Bearer ${process.env.YELPKEY}` },
});

router.post("/", async (req, res, next) => {
  console.log(req.body);

  const userId = req.query.userId;

  const query = `
      query search($term: String!, $location: String, $categories: String) {
        search(
          term: $term,
          location: $location,
          categories: $categories
        ) {
        total
        business {
          id
          name
          categories{
            title
          }
          display_phone
          hours {
            is_open_now
        }
          rating
          price
          location {
            address1
            city
          }
          reviews {
            text
            rating
            time_created
            user{
                name
            }
          }
          photos
        }
      }
    }`;

  try {
    const data = await client.request(query, req.body);

    const newRestaurantResponse = data.search.business.map(
      ({ id, name, photos, price, rating, location, reviews, categories }) => {
        return {
          restaurant_id: id,
          name: name,
          photos: photos,
          price: price,
          rating: rating,
          location: location,
          reviews: reviews,
          categories: categories,
        };
      }
    );
    console.log(newRestaurantResponse);
    //this clones the object
    const databaseRestaurant = JSON.parse(
      JSON.stringify(newRestaurantResponse)
    ).map(
      ({
        restaurant_id,
        name,
        photos,
        price,
        rating,
        location,
        reviews,
        categories,
      }) => {
        return {
          restaurant_id: restaurant_id,
          name: name,
          photos: photos.toString(),
          price: price,
          rating: rating.toString(),
          location: location.address1,
          reviews: reviews,
          categories: categories
            .map((element) => {
              return element.title;
            })
            .join(","),
        };
      }
    );

    await prisma.Restaurants.createMany({ //createMany creates multiple restaurants an skips duplicates
      data: databaseRestaurant,
      skipDuplicates: true,
    }); //returns count of the number of restaurants created

    console.log(databaseRestaurant);

    

    res.status(200).json(databaseRestaurant);
  } catch (err) {
    console.log(err);
  }
});

//post favourite restaurants
router.post("/favourites", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);

  const {
    restaurant_id,
    name,
    photos,
    price,
    rating,
    location,
    reviews,
    categories,
  } = req.body.restaurantDetails;

  console.log(req.body.restaurantDetails);
  

  const params = {
    restaurant_id: restaurant_id,
    name: name,
    photos: photos,
    categories: categories,
    price: price,
    rating: rating.toString(),
    location: location.address1,
    reviews: reviews,

    users: {
      connect: {  //connect existing restaurant id to a user id 
        user_id: userId,
      },
    },
  };

  const favouriteRestaurants = await prisma.Restaurants.upsert({
    where: {
      restaurant_id: restaurant_id,
    },
    create: params,
    update: params,
  });

  console.log(favouriteRestaurants);
});

//get favourite restaurants
router.get("/favourites", async (req, res) => {
  const userId = req.query.userId;
  const user = await prisma.Users.findUnique({
    where: {
      user_id: parseInt(userId),
    },
    include: {
      restaurants: true,
    },
  });
  console.log("the user id is" + userId);

  const favouriteRestaurants = user.restaurants;
  console.log(user.restaurants);

  favouriteRestaurants.forEach((element) => {
    element.name = element.name;
    element.photos = element.photos;
    element.isLiked = true;
  });

  res.json(favouriteRestaurants);
});

//get single restaurant
router.get("/:restaurantId", async (req, res) => {
  const restaurant_id = req.params.restaurantId;
  const userId = req.query.userId;

  const userRestaurant = await prisma.Restaurants.findUnique({
    where: {
      restaurant_id: restaurant_id,
    },
    include: {
      users: true,
    },
  });

  

  userRestaurant.isLiked = userRestaurant.users.some(
    (user) => (user.user_id === userId)
  );

  res.status(200).json(userRestaurant);
});

//delete - unfavourite restaurants

router.delete("/favourites/:restaurantId", async (req, res) => {
  const userId = req.query.userId;
  const id = req.params.restaurantId

  await prisma.Restaurants.update({
    where: {
      restaurant_id: id,
    },
    data: {
      users: {
        disconnect: [{ user_id: parseInt(userId) }],
      },
    },
  });
 
});

module.exports = router;
