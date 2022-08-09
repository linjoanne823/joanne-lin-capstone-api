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

  const userId = req.query.userId

//   id=req.query.business.id

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
    // res.json(data);

    // prisma.Restaurants.findMany({
    //     where:{
    //         restaurant_id: data.search.business.id
    //     },
    //     include:{
    //         users:true
    //     }
    // })

    // const userAndRestaurant = (userRestaurant)=>{
    //     if(userRestaurant === null){
    //         data.search.business.isLiked = false;
    //     }else{
    //         data.search.business.isLiked=userRestaurant.users.some((user)=>(
    //             user.user_id = userId
    //         ))
    //     }

    // }
    // userAndRestaurant();

    res.status(200).json(data)

  
  } catch (err) {
    console.log(err);
  }
});

//post favourite restaurants
router.post("/favourites", async(req, res) => {

    const userId = req.body.userId
    console.log(userId)

    const {
        id,
        name,
        photos,
        price,
        rating,
        location,
        reviews,
        categories,
 
    } = req.body.restaurant;

    const params ={
        restaurant_id: id,
        name: name,
        photos: photos[0],
        // categories: categories,
        price: price,
        rating: rating.toString(),
        // location: location,
        // reviews: reviews,
        users:{
            connect:{
                user_id:userId,
            }
        }
    };
    
    const favouriteRestaurants = await prisma.Restaurants.upsert({
        where:{
            restaurant_id: id,
        },
        create: params,
        update: params,
    })

    console.log(favouriteRestaurants)
});

//get favourite restaurants
router.get("/favourites", async(req,res)=>{
    const userId = req.query.userId
    const user = await prisma.Users.findUnique({
        where:{
            user_id: parseInt(userId),
        },
        include:{
            restaurants:true,
        }

    })
    console.log("the user id is" + userId)

    const favouriteRestaurants = user.restaurants

    res.json(favouriteRestaurants)
})

module.exports = router;
