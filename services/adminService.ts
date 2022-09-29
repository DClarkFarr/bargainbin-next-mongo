import { Category } from "@/types/Category";
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
    register(name: string, email: string, password: string) {
        return this.client
            .put<{ admin: Admin }>("/admin/auth", {
                name,
                email,
                password,
            })
            .then((res) => res.admin);
    }

    updateCategorySorts(categoryIds: string[]) {
        return this.client
            .post("/admin/categories/sort", { categoryIds })
            .then(() => {});
    }
    updateCategory(
        id: string,
        toUpdate: Partial<
            Omit<Category, "id" | "createdAt" | "syncedAt" | "squareUpdatedAt">
        >
    ) {
        return this.client
            .put<{ category: Category<Date> }>(
                `/admin/categories/${id}`,
                toUpdate
            )
            .then(({ category }) => category);
    }
}

export default AdminService;
