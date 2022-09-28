import { Admin } from "../types/Admin";
import ServerService from "./ServerService";

class AdminService extends ServerService {
    getAuthedAdmin() {
        return this.client
            .get<{ admin: Admin }>("/admin/auth")
            .then((res) => res.admin);
    }
    login(email: string, password: string) {
        return this.client
            .post<{ admin: Admin }>("/admin/auth", { email, password })
            .then((res) => res.admin);
    }
    logout() {
        return this.client.delete("/admin/auth", {}).then(() => {});
    }
}

export default AdminService;
