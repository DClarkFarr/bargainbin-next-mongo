import { User } from "../types/User";
import ServerService from "./ServerService";

class UserService extends ServerService {
    login(email: string, password: string): Promise<User> {
        return this.client.post("/auth", { email, password });
    }
    logout(): Promise<void> {
        return this.client.delete("/auth", {}).then(() => {});
    }
    register(name: string, email: string, password: string): Promise<User> {
        return this.client.post("/user", { name, email, password });
    }
    getAuthedUser() {
        return this.client.get<{ user: User }>("/user").then((res) => res.user);
    }
    newsletterSignup(token: string, email: string) {
        return this.client.post<{ success: boolean; cache: boolean }>(
            `/user/newsletter`,
            { token, email }
        );
    }
}

export default UserService;
