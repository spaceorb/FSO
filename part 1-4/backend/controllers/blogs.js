const blogRouter = require("express").Router();
const Blogs = require("../models/blogs");
const BlogUsers = require("../models/blogusers");
const jwt = require("jsonwebtoken");

blogRouter.post("/", async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  console.log("decodedToken", decodedToken);

  const user = await BlogUsers.findById(decodedToken.id);

  const { title, author, url, likes } = req.body;
  const blog = new Blogs({ title, author, url, likes, bloguser: user._id });

  user.blog = user.blog.concat(blog._id);
  await user.save();
  await blog.save();

  if (blog.likes === undefined) blog.likes = 0;
  if (blog.title === undefined || blog.url === undefined) {
    res.status(400).json({ error: "Title or Url missing" });
  } else {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  }
});

blogRouter.get("/", async (req, res) => {
  const result = await Blogs.find({}).populate("bloguser", {
    username: 1,
  });
  res.json(result);
});

blogRouter.delete("/:id", async (req, res) => {
  // const decodedToken = jwt.verify(req.token, process.env.SECRET);
  // if (!decodedToken.id) res.status(400).json({ error: "Invalid token." });

  const blog = await Blogs.findById(req.params.id);
  if (!blog) res.status(404).json({ error: "Blog not found" });

  // const user = req.user;
  // console.log("USER!", user);

  // const blogUserId = blog.bloguser.toString();
  // const userId = decodedToken.id.toString();

  // if (blogUserId === userId) {
  await Blogs.findByIdAndRemove(req.params.id);
  res.status(204).end();
  // }
});

blogRouter.put("/:id", async (req, res) => {
  // const { author, title, url, likes } = req.body;

  const blog = await Blogs.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  });

  res.status(200).json(blog);
});

module.exports = blogRouter;
