const bcrypt = require("bcrypt");
const blogUserRouter = require("express").Router();
const BlogUsers = require("../models/blogusers");
// const jwt = require("jsonwebtoken");

// create new user
blogUserRouter.get("/", async (req, res) => {
  const users = await BlogUsers.find({}).populate("blog", {
    author: 1,
    title: 1,
    likes: 1,
  });

  res.json(users);
});

blogUserRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "Password must be atleast 3 characters long." });
  }

  // sign up using request
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new BlogUsers({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = blogUserRouter;

// loginRouter post: Checks to see if user is in user db.
// userRouter post: Sign up as a new user with credentials.
// blogRouter: Handle all blog requests.

// Create new users by doing an POST request to address /api/users
