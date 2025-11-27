// modules
import mongoose from "mongoose";
import chalk from "chalk";
// constants
import { MONGO_URI } from "src/config/env";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(chalk.bgGreen.bold("Database connected successfully."));
    } catch (error) {
        console.log(chalk.bgRed.bold("Can't connect to database.", error));
    }
}