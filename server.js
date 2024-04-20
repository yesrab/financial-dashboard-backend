const express = require("express");
require("express-async-errors");
require("dotenv").config();
const status = require("express-status-monitor");
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

app.use(
  status({
    path: "/api/v1/status",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from the server",
    status: "success",
    currentTime: new Date().toISOString(),
    path: req.path,
    url: req.originalUrl,
  });
});

const transactionsRouter = require("./routes/transactions");

app.use("/api/v1/transactions", transactionsRouter);

const globalErrorHandler = require("./middleware/globalErrorHandler");
app.use(globalErrorHandler);

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
