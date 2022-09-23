export const ValidateProps = {
    user: {
        name: { type: "string", minLength: 1, maxLength: 50 },
        password: { type: "string", minLength: 8 },
        email: { type: "string", minLength: 1 },
    },
    post: {
        content: { type: "string", minLength: 1, maxLength: 280 },
    },
    comment: {
        content: { type: "string", minLength: 1, maxLength: 280 },
    },
};
