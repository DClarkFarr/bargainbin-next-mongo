import { User } from "../types/User";
import ServerService from "./ServerService";

class UserService extends ServerService {
    login(email: string, password: string): Promise<User> {
        return this.client.post("/auth", { email, password });
    }
    register(name: string, email: string, password: string): Promise<User> {
        return this.client.post("/user", { name, email, password });
    }
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
