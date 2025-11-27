// modules
import { Resend } from "resend";
import chalk from "chalk";
// constants
import { RESEND_API_KEY } from "src/config/env";

export const resend = new Resend(RESEND_API_KEY);

(async () => {
    const { error } = await resend.domains.list();
    if (error) {
        console.log(chalk.bgRed.bold("Resend initialization failed:", error.message));
    } else {
        console.log(chalk.bgBlue.bold("Resend is ready to send emails."));
    }
})();