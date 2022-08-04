const express = require("express");
const router = express.Router();
const yelpApiUrl = "https://api.yelp.com/v3/graphql";
const { GraphQLClient } = require("graphql-request");

const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());
router.use(bodyParser.json());

const client = new GraphQLClient(yelpApiUrl, {
  headers: { Authorization: `Bearer ${process.env.YELPKEY}` },
});

router.post("/", async (req, res, next) => {
  console.log(req.body);

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
          hours {
            is_open_now
            open {
              start
              end
            }
        }
          rating
          price
          location {
            address1
            city
            state
            country
          }
          reviews {
            text
            rating
            time_created
            url
          }
          photos
        }
      }
    }`;

  try {
    const data = await client.request(query, req.body);
    res.json(data);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});

const favouriteRestaurants = [
  {
    name: "Nuba in Yaletown",
    photo:
      "https://s3-media1.fl.yelpcdn.com/bphoto/0vWrG0-_3xrIPmjuutNoBQ/o.jpg",
    categories: "Mediterranean",
    ratings: "⭐⭐⭐⭐",
    price: "$$",
    location: "508 Davie Street",
    reviews:
      "I went here today as a late vegan lunch around 3pm. I love the decor and you will get free water and they clean the table after every customer. Washrooms...",
  },
  {
    name: "MeeT in Yaletown",
    photo:
      "https://s3-media1.fl.yelpcdn.com/bphoto/e7NmgE8OZewxRbcjqIjoJw/o.jpg",
    categories: "Comfort Food",
    ratings: "⭐⭐⭐",
    price: "$$",
    location: "1165 Mainland Street",
    reviews:
      "I've been vegan for about 13 years and this is some of the most fantastic vegan food I've ever had. My Omni wife humored me by going with me and after she...",
  },
];
//get favourite restaurants
router.get("/favourites", (req, res) => {
  const favouriteRestaurant = favouriteRestaurants.map((element) => {
    return {
      name: element.name,
      photo: element.photo,
      categories: element.categories,
      ratings: element.ratings,
      price: element.price,
      location: element.location,
      reviews: element.reviews,
    };
  });
  res.json(favouriteRestaurant);
});

module.exports = router;
