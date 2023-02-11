const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js Coder1339"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://rf-draftbot:${password}@serverlessinstance0.c1civ.mongodb.net/noteApp?retryWrites=true&w=majority`;
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number,
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

if (process.argv.length > 3) {
  const person = new Phonebook();
  person.name = process.argv[3];
  person.number = process.argv[4];

  console.log(`added ${person.name} number ${person.number} to phonebook`);
  return person.save();
} else {
  console.log(
    Phonebook.find({})
      .then((result) =>
        result.forEach((person) =>
          console.log(`${person.name} ${person.number}`)
        )
      )
      .then(() => mongoose.connection.close())
  );
}
