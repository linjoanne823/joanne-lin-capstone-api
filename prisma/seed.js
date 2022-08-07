const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addDefaultUser = async () => {
  try {
    const users = await prisma.Users.create({
      data: {
        first_name: "Joanne",
        last_name: "Lin",
        email: "joanne@gmail.com",
        password: "abc",
        city: "Vancouver",
        register_date: new Date(),
      },
    });
    console.log(users);
  } catch (err) {
    console.log(err);
  }
};


addDefaultUser();