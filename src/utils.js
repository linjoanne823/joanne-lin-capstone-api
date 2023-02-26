const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config;

//Hash user password, so database doesn't store plain text passwords. 
const hash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  return password;
};

//Compare hashed password
const compare = async (hash, password) => {
  return bcrypt.compare(hash, password);
};

//Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = {
  hash,
  compare,
  generateToken,
};
