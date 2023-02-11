// Includes the functions to test

// const dummy = () => {
//   return 1;
// };
const Blog = require("../models/blogs");

const totalLikes = (blogs) => {
  // sum of likes in blogs
  if (blogs.length === 0) return 0;
  else if (blogs.length === 1) return blogs[0].likes;

  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  // Find blog with most likes
  if (blogs.length === 0) return {};
  else if (blogs.length === 1) return blogs[0];

  let favBlog = blogs[0];

  blogs.forEach((blog) =>
    blog.likes > favBlog.likes ? (favBlog = blog) : null
  );

  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  };
};

const blogsInDb = async () => {
  const result = await Blog.find({});
  return result.map((blog) => blog.toJSON());
};

module.exports = { totalLikes, favoriteBlog, blogsInDb };
