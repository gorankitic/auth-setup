const nodemailer = require('nodemailer');
const colors = require("colors/safe");

// Configure environment variables
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("❗❗❗Transporter verification failed: ", colors.bgRed.bold(error));
    } else if (success) {
        console.log(colors.bgBlue.bold("Nodemailer transporter ready to send emails."));
    }
});

module.exports = transporter;