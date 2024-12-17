import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false ,
    service: 'SendGrid',
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PWD,
    }
});

export const sendEmail = async (to, body, text, subject)=>{
    const res = await transporter.sendMail({
        to: to,
        text: text,
        html: body,
        from: process.env.MAIL_NAME,
        subject: subject || 'New Mail'
    });
    return true;
}

