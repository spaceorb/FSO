require("dotenv").config();

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const MONGODB =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB
    : process.env.MONGODB;

module.exports = {
  MONGODB,
  PORT,
  SECRET,
};
