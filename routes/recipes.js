const router = require("express").Router();
const cors = require("cors");
router.use(cors());

//routes
router.get("/", (req,res)=>{
    res.send("recipes get endpoint reached!");
})

module.exports=router;