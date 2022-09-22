import slug from "slug";

export const slugUsername = (username: string) => slug(username, "_");
