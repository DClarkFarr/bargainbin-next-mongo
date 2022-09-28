export type Admin = {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    profilePicture: string;
    role: "owner" | "admin";
};
