export type User<R = "user" | "admin"> = {
    id: number;
    name: string;
    email: string;
    role: R;
};
