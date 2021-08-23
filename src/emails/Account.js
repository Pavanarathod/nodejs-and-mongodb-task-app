// @ts-nocheck
const sgMail = require("@sendgrid/mail");

const key = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(key);

const sendWelcomeEmailsEmails = (email, name) => {
  sgMail.send({
    to: email,
    from: "pavan.pattinson@gmail.com",
    subject: "Tahnks for Joining in",
    text: `Welcome to App ${name} let me know how to get Along Create you'r first task`,
  });
};

const sendDeleteNotification = (email, name) => {
  sgMail.send({
    to: email,
    from: "pavan.pattinson@gmail.com",
    subject: "Thanks for you'r time Join Again",
    text: `Thanks for you'r time ${name} if you want join again click the link below`,
  });
};

module.exports = { sendWelcomeEmailsEmails, sendDeleteNotification };
