// utils
import { resend } from "./resend";

type EmailInput = {
    to: string,
    subject: string,
    html: string
}

export const sendEmail = async ({ to, subject, html }: EmailInput) => {
    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject,
        html,
    });

    return { data, error }
};