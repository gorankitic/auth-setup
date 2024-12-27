const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const colors = require("colors/safe");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const { limiter } = require("./middlewares/limiters");
const { protect, restrictTo } = require("./middlewares/authMiddlewares");

// Configure environment variables
require("dotenv").config();

// Initialize express application
const app = express();

// MIDDLEWARES

// Setting security http headers
app.use(helmet());
// Prevent brute-force attacks, limit number of requests from same IP address
app.use("/api", limiter);
// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Body and cookie parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// (Routers)
app.use("/api/users", userRouter);
app.use("/api/test", protect, restrictTo("user"), (req, res, next) => {
    res.status(200).json({ status: "success" });
})

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
(async () => {
    try {
        // Connect to MongoDb
        await mongoose.connect(process.env.MONGO_URI);
        console.log(colors.bgGreen.bold("Database connected successfully."));
        // Start listening for http requests
        app.listen(port, () => {
            console.log(colors.bgGreen.bold(`Server is up in ${process.env.NODE_ENV} mode on port ${port}.`));
        });
    } catch (error) {
        console.log("❗❗❗ERROR: ", colors.bgRed.bold(error.message));
    }
})();