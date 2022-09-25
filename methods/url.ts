export const toSlug = (str: string) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[\s_/]/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/^-|-$/, "");
};
