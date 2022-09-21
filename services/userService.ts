import { User } from "../types/User";
import ServerService from "./ServerService";

class UserService extends ServerService {
    getAuthedUser() {
        return this.client.get<null, { user: User }>("/user");
    }
    newsletterSignup(token: string, email: string) {
        return this.client.post<
            { token: string; email: string },
            { success: boolean; cache: boolean }
        >(`/user/newsletter`, { token, email });
    }
}

export default UserService;
