// create a new blog user schema

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const BlogUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blog: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

BlogUserSchema.plugin(uniqueValidator);

BlogUserSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.passwordHash;
  },
});

module.exports = mongoose.model("bloguser", BlogUserSchema);
