const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const itemsRouter = require("./controllers/item");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const bidRouter = require("./routes/bidRouter");
const shipmentRouter = require("./routes/shipmentRouter");
const url = config.MONGODB_URI;
logger.info("connecting to MongoDB");

mongoose.connect(url).then(() => {
  logger.info("connected to MongoDB");
});

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use("/api/bid", bidRouter);
app.use("/api/shipment", shipmentRouter);
app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
