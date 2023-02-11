const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const blogUserRouter = require("./controllers/blogusers");
const blogLogin = require("./controllers/bloglogin");
// const notesRouter = require("./controllers/notes");
// const usersRouter = require("./controllers/users");
// const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const userExtractor = require("./utils/middleware").userExtractor;
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
logger.info("connecting to", config.MONGODB);

mongoose
  .connect(config.MONGODB)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// const Phonebook = require("./models/phonebook");
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use("/api/blogusers", blogUserRouter);
app.use("/api/bloglogin", blogLogin);
app.use("/api/blogs", userExtractor, blogRouter);

// app.use("/api/notes", notesRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.get("/api/phonebook", (request, response) => {
//   Phonebook.find({}).then((result) => {
//     response.json(result);
//   });
// });

// app.get("/api/phonebook/:id", (request, response, next) => {
//   // error passed forward is given to next function as a parameter.
//   // if next called w/o parameter execution would simply move onto
//   // next route or middleware.
//   // if next called w/ parameter, execution will continue to the
//   // error handler middleware.

//   Phonebook.findById(request.params.id)
//     .then((obj) => {
//       if (obj) {
//         response.json(obj);
//       } else {
//         response.status(404).end();
//       }
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// app.post("/api/phonebook", (request, response, next) => {
//   const { name, areaCode, digits } = request.body;

//   const person = new Phonebook({ name, areaCode, digits });
//   console.log("NEW person id", person.id);

//   person
//     .save()
//     .then((savedResult) => response.json(savedResult))
//     .catch((error) => {
//       next(error);
//     });
// });

// app.put("/api/phonebook/:id", (request, response, next) => {
//   const { name, areaCode, digits } = request.body;

//   const person = { name, areaCode, digits };

//   console.log("new new person", person);
//   Phonebook.findByIdAndUpdate(request.params.id, person, {
//     new: true,
//     runValidators: true,
//   })
//     .then((updatedPerson) => response.json(updatedPerson))
//     .catch((error) => next(error));
// });

// app.delete("/api/phonebook/:id", (request, response, next) => {
//   Phonebook.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end();
//     })
//     .catch((err) => next(err));
// });

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

// const errorHandler = (error, request, response, next) => {
//   if (error.name === "CastError") {
//     return response.status(400).send({ error: "malformatted id" });
//   } else if (error.name === "ValidationError") {
//     return response.status(400).json({ error: error.message });
//   }

//   next(error);
// };

// app.use(errorHandler); // this has to be last loaded middleware
