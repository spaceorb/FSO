require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB;

mongoose
  .connect(url)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error in connecting to MongoDB", err));

const PhonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  areaCode: {
    type: String,
    minLength: 2,
    maxLength: 3,
    required: true,
  },
  digits: {
    type: String,
    minLength: 6,
    required: true,
  },
});

PhonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", PhonebookSchema);
