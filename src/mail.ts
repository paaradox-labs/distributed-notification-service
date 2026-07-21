import { Message, NotificationTransport } from "./types/notification-types";
import nodemailer, { Transporter } from "nodemailer"
import config from "config"

export class MailTransport implements NotificationTransport {

    private transporter: Transporter;

    constructor() {
    this.transporter = nodemailer.createTransport({
        host: config.get("mail.host"),
        port: config.get("mail.port"),
        secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
            user: config.get("mail.auth.user"),
            pass: config.get("mail.auth.pass"),
        },
    });
}

    async send(message: Message){
    const info = await this.transporter.sendMail({
        from: config.get("mail.from"), 
        // todo: validate for a valid email
        to: message.to, 
        subject: message.subject,
        text: message.text, 
        html: message.html, 
        });

        // todo: use winston in future for logging
        console.log("Message sent: %s", info.messageId);
    }
}
