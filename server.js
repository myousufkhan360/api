const { error } = require("console");
let express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  dbConfig = require("./db/database");
const { create } = require("./model/student.model");
const createError = require('http-errors');

// Connection MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, { useNewUrlParser: true }).then(
  () => {
    console.log("Database Connected!");
  },
  (error) => {
    console.log("Database not connected: " + error);
  }
);

// Setting up Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Api root
const userRoute = require("./routes/student.routes");
app.use("/api", userRoute);

// Creating Port
const port = process.env.port || 8080;

// Connecting port to server
const server = app.listen(port, () => {
  console.log("Port Connected to: " + port);
});

//Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Index Route
app.get("/", (req, res) => {
  res.send("invaild endpoint");
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

// Static build location
app.use(express.static(path.join(__dirname, "dist")));