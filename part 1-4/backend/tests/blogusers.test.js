const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const BlogUsers = require("../models/blogusers");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await BlogUsers.deleteMany({});

  const passwordHash = await bcrypt.hash("cool", 10);

  let newUser = new BlogUsers({
    username: "Admin",
    name: "Aiden",
    passwordHash,
  });

  await newUser.save();
}, 10000);

test("ensure invalid users are not created", async () => {
  const startUsers = await BlogUsers.find({});

  const userWithBadUsername = {
    username: "Jo",
    name: "Joe",
    password: "starfish",
  };

  const userWithBadPassword = {
    username: "JoeSmith",
    name: "Joe",
    password: "So",
  };

  const checkUsers = async (user) => {
    await api
      .post("/api/blogusers")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  };

  checkUsers(userWithBadUsername);
  checkUsers(userWithBadPassword);

  const endUsers = await BlogUsers.find({});
  expect(endUsers).toEqual(startUsers);
});

afterAll(async () => {
  await mongoose.connection.close();
});
