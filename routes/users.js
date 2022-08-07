const express = require("express");
const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.use(cors());
router.use(bodyParser.json());

router.put("/", async (req, res) => {
  const userId = req.body.userId;

  const {
    firstName,
    lastName,
    email,
    password,
    city,
    dietaryRestriction,
    allergies,
  } = req.body;

  const updateUser = await prisma.Users.update({
    where: {
      user_id: userId,
    },
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      city: city,
      dietary_restrictions: dietaryRestriction,
      allergies: {
        connectOrCreate: allergies.map((allergy)=>{
            return {
                where:{allergy_name: allergy},
                create:{allergy_name:allergy}
            }
        })
      },
    },
  });
  res.json(updateUser);
});

module.exports = router;
