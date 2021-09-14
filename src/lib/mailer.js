import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

let transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

exports.send = function (to, subject, html) {
  return transporter.sendMail({
    from: mailConfig.default.from,
    to: to,
    subject: subject,
    html: html,
  });
};
