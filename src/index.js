require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

/**
 * Database setup
 */
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(require("./routes"));

app.listen(process.env.PORT || process.env.port || 4000, () => {
  console.clear();
  console.log(
    `Server started on port ${String(process.env.APP_URL).replace('4000/', '')}${process.env.PORT || process.env.port || 4000}/`
  );
});
