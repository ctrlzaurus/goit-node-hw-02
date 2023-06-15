// const Mailjet = require('node-mailjet');
const sendgrid = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY);

const sendEmail= async (data, from = SENDGRID_FROM) => {
    try {
        const email = { ...data, from };
        await sendgrid.send(email);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = sendEmail;

// const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

// const mailjet = new Mailjet({
//     apiKey: MJ_APIKEY_PUBLIC,
//     apiSecret: MJ_APIKEY_PRIVATE,
// });

// const sendEmail = async (data, from = MJ_SENDER_EMAIL) => {
//     try {
//         const email = { 
//             Messages: [
//                 {
//                 From: {
//                     Email: from,
//                     Name: 'Your Name' // Replace with your name or desired sender name
//                 },
//                 To: [
//                     {
//                     Email: data.email, // Email address to send the verification email
//                     Name: 'Recipient Name' // Replace with recipient's name or leave empty
//                     }
//                 ],
//                 Subject: 'Email Verification', // Subject of the verification email
//                 TextPart: 'Please click the link to verify your email address.', // Body of the verification email (plain text)
//                 HTMLPart: '<p>Please click the link to verify your email address.</p>' // Body of the verification email (HTML)
//                 }
//             ]
//         };
//         const response = await mailjet.post('send', { version: 'v3.1' }).request(email);
//         return response.body;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return false;
//     }
// }



// const request = mailjet
//         .post('send', { version: 'v3.1' })
//         .request({
//           Messages: [
//             {
//               From: {
//                 Email: MJ_SENDER_EMAIL,
//                 // Name: "Mailjet Pilot"
//               },
//               To: [
//                 {
//                   Email: "xevoyi3604@pyadu.com",
//                 //   Name: "passenger 1"
//                 }
//               ],
//               Subject: "Your email flight plan!",
//               TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
//               HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
//             }
//           ]
//         })

// request
//     .then((result) => {
//         console.log(result.body)
//     })
//     .catch((err) => {
//         console.log(err.statusCode)
//     })

// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const { META_PASSWORD, META_USER } = process.env;

// const nodemailerConfig = {
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: META_USER,
//         pass: META_PASSWORD,
//     }
// }

// const transport = nodemailer.createTransport(nodemailerConfig);

// const sendEmail = async (data) => {
//     const mail = { ...data, from: META_USER };
//     try {
//         await transport.sendMail(mail);
//         return true;
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// module.exports = sendEmail;

// const mail = {
//     to: 'vayix58500@pyadu.com',
//     from: META_USER,
//     subject: 'Hi!',
//     html: '<p> ... </p>'
// }

// transport.sendMail(mail)
//     .then(() => console.log('Sent'))
//     .catch((err) => console.log(err))