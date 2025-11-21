import { User } from "../../models/user.model.ts"
import { Session } from "../../models/session.model.ts"

declare global {
    namespace Express {
        interface Request {
            user?: User;
            session?: Session;
        }
    }
}
