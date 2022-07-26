const router = require("express").Router();
const cors = require("cors");
const axios = require("axios");
router.use(cors());

//routes
router.get("/", (req, res) => {
  res.send("restaurants get endpoint reached!");
});

router.get("/test", (req, res) => {
  axios
    .get("https://api.yelp.com/v3/businesses/search", {
      headers: {
        Authorization: `Bearer ${process.env.YELPKEY}`,
      },
      params: {
        location: "Vancouver",
        limit: '5',
      },
    })
    .then((apiResponse) => {
      console.log(apiResponse.data);
      res.status(200).json(apiResponse.data);
    })
    .catch(() => res.status(500).send("error"));
});
module.exports = router;
