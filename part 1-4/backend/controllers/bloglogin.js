// const config = require("../utils/config");
// const jwt = require("jsonwebtoken");
// const loginRouter = require("express").Router();
// const BlogUser = require("../models/blogusers");
// const bcrypt = require("bcrypt");

// loginRouter.get("/", async (req, res) => {
//   const user = await BlogUser.findOne({ username: username });

//   if (user) {
//     res.json(user);
//   }
// });

// loginRouter.post("/", async (req, res) => {
//   const { username, password } = req.body;

//   const user = BlogUser.findOne({ username: username });
//   const valid = bcrypt.compare(password, user.password);

//   if (!valid || !user) {
//     return res.status(400).json({ error: "Incorrect username or password." });
//   }

//   const userForToken = {
//     username: user.username,
//     id: user.id,
//   };

//   const token = jwt.sign(userForToken, config.SECRET);

//   res.status(201).json(user);
// });

// module.exports = loginRouter;

const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlogUsers = require("../models/blogusers");

// post request to loginRouter to create a custom token
loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await BlogUsers.findOne({ username });
  if (!user) {
    res.status(400).json({ error: "username not found." });
  }
  const validPass = await bcrypt.compare(password, user.passwordHash);
  if (!validPass) {
    res.status(400).json({ error: "incorrect password." });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
