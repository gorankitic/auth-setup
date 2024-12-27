const transporter = require("./emailTransporter");

const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: "Application <application@mail.com>",
        to,
        subject,
        html
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;