import { NextApiRequest } from "next";
import { Session } from "next-session/lib/types";
import nc from "next-connect";
import isEmail from "validator/lib/isEmail";
import { ncOpts } from "@/api-lib/nc";
import session from "@/api-lib/middleware/session";
import isAdmin from "@/api-lib/middleware/isAdmin";
import AdminModel from "@/api-lib/db/adminModel";
import { ValidateProps } from "@/api-lib/constants";
import { validateBody } from "@/api-lib/middleware";

const handler = nc(ncOpts);

handler.use(session);

/**
 * Get authenticated admin
 */
handler.get(isAdmin, (req, res) => {
    res.json({ admin: req.session.admin });
});

/**
 * Login
 */
handler.post(async (req: NextApiRequest & { session: Session }, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }

    const adminModel = await AdminModel.factory();

    const admin = await adminModel.findWithEmailAndPassword(email, password);

    if (admin) {
        req.session.admin = admin;
        return res.status(200).json({ admin });
    } else {
        return res.status(401).json({ message: "Email/Password invalid" });
    }
});

/**
 * Register
 */
handler.put<NextApiRequest & { session: Session }>(
    validateBody({
        type: "object",
        properties: {
            name: ValidateProps.user.name,
            password: ValidateProps.user.password,
            email: ValidateProps.user.email,
        },
        required: ["name", "password", "email"],
        additionalProperties: false,
    }),
    async (req, res) => {
        const adminModel = await AdminModel.factory();

        let { name, email, password } = req.body;

        if (!isEmail(email)) {
            res.status(400).json({
                error: { message: "The email you entered is invalid." },
            });
            return;
        }

        if (await adminModel.findByEmail(email)) {
            res.status(403).json({
                error: { message: "The email has already been used." },
            });
            return;
        }

        const admin = await adminModel.create({
            email,
            password,
            name,
        });

        req.session.admin = admin;

        return res.json({ admin });
    }
);

/**
 * Logout
 */

handler.delete(async (req: NextApiRequest & { session: Session }, res) => {
    await req.session.destroy();

    res.status(204).end();
});

export default handler;
