const express = require("express");
require("express-async-errors");
requirerequire("dotenv").config();
const connectDB = require("./db/connect");

//env
const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB;
//env

const app = express();

//express body json parsing middleware
app.use(express.json());

//express url parsing middleware
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from the server",
    status: "success",
    currentTime: new Date().toISOString(),
    path: req.path,
    url: req.originalUrl,
  });
});

//start server and connet to db
const startServer = async () => {
  try {
    await connectDB(DB_URI);
    console.log("DB connected");
    app.listen(PORT, () => console.log(`Server is listening port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
