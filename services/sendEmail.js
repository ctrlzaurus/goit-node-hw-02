const nodemailer = require('nodemailer');
require('dotenv').config();

const { META_PASSWORD, META_USER } = process.env;

const nodemailerConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: META_USER,
        pass: META_PASSWORD,
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    const mail = { ...data, from: META_USER };
    try {
        await transport.sendMail(mail);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = sendEmail;

// const mail = {
//     to: 'vayix58500@pyadu.com',
//     from: META_USER,
//     subject: 'Hi!',
//     html: '<p> ... </p>'
// }

// transport.sendMail(mail)
//     .then(() => console.log('Sent'))
//     .catch((err) => console.log(err))