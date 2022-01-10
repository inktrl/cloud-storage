const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активація аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h3>Для підтвердження аккаунта перейдіть за посиланням:</h3>
                        <a href="${link}" class="button is-primary">Підтвердити</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService;