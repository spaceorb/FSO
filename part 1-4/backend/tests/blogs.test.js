// Writes the tests for individual imported functions
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./list_helper");

const Blog = require("../models/blogs");

beforeEach(async () => {
  await Blog.deleteMany({});

  let newBlog = new Blog({
    title: "testing",
    author: "peter",
    likes: 3,
  });

  await newBlog.save();
});

test("blog update is successful", async () => {
  const newBlog = {
    author: "Mango J.",
    title: "Fireflies",
    url: "peewee.io",
    likes: 10,
  };

  const firstBlog = await helper.blogsInDb();

  const response = await api
    .put(`/api/blogs/${firstBlog[0].id}`)
    .send(newBlog)
    .expect(200);

  expect(response.body.likes).toBe(10);
  const updatedBlogs = await helper.blogsInDb();
  updatedAuthors = updatedBlogs.map((r) => r.author);
  expect(updatedAuthors).toContain("Mango J.");
});

test("blog deletion is successful", async () => {
  const blogs = await helper.blogsInDb();
  const firstBlogId = blogs[0].id;

  console.log("blogs", blogs);
  console.log("firstBlog", blogs[0]);
  await api.delete(`/api/blogs/${firstBlogId}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(0);
});

test("creating new blog checks if title or url is missing", async () => {
  const blogWithTitle = {
    author: "Benjamin C.",
    title: "Cloudy Skies",
    likes: 10,
  };

  const blogWithUrl = {
    author: "Benjamin C.",
    url: "www.abc.com",
    likes: 10,
  };

  const checkProperty = async (blog) => {
    return await api
      .post("/api/blogs")
      .send(blog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  };

  checkProperty(blogWithTitle);
  checkProperty(blogWithUrl);
});

test("defaults likes to 0 if missing", async () => {
  const testObj = {
    author: "blah blah",
    title: "harry potter",
    url: "test.com",
  };

  const result = await api
    .post("/api/blogs")
    .send(testObj)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(result.body.likes).toBe(0);
});

test("get all blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(1);
});

test("a blog can be added", async () => {
  const newBlog = {
    author: "Little Ceasers",
    title: "Pizza",
    url: "pizzab.com",
    likes: 20,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.blogsInDb();
  expect(notesAtEnd).toHaveLength(2);
});

test("verify unique id is named 'id'", async () => {
  const response = await api.get("/api/blogs");
  const firstData = response.body[0];

  expect(firstData.id).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});
