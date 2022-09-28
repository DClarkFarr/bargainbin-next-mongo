import { passport } from "../../api-lib/auth";
import { auths } from "../../api-lib/middleware";
import { ncOpts } from "../../api-lib/nc";
import nc from "next-connect";
import { NextApiRequest } from "next";
import { SessionStore } from "next-session";
import { Session } from "next-session/lib/types";
import UserModel from "@/api-lib/db/userModel";

const handler = nc(ncOpts);

handler.use(...auths);

/**
 * Login
 */
handler.post(async (req: NextApiRequest & { session: Session }, res) => {
    const userModel = await UserModel.factory();

    const user = await userModel.findWithEmailAndPassword(
        req.body.email,
        req.body.password
    );

    if (user) {
        req.session.user = user;
        return res.status(200).json({ user });
    } else {
        return res.status(401).json({ message: "Email/Password invalid" });
    }
});

/**
 * Logout
 */
handler.delete(async (req: NextApiRequest & { session: SessionStore }, res) => {
    await req.session.destroy("");
    res.status(204).end();
});

export default handler;
