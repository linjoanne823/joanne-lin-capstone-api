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

module.exports = router;
