const nodemailer = require('nodemailer');
const sendEmail = async options => {
    // 1) Create a transporter

    // const transporter = nodemailer.createTransport({
    //     host:process.env.EMAIL_HOST,
    //     port:process.env.EMAIL_PORT,
    //     auth:{
    //         user:process.env.EMAIL_USERNAME,
    //         password:process.env.EMAIL_PASSWORD
    //     }
    // })
    
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 25,
        auth: {
          user: "0400bfc1c45b67",
          pass: "999a402275a4c2"
        }
      });
    // 2) Define email options
    const mailOptions = {
        from:'Kamrul Hasan Rahat <khrahat92@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        // html:

    }
    // 3) Actually send the email
    await transporter.sendMail(mailOptions)
}
module.exports = sendEmail