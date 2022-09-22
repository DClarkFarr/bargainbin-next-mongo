import { passport } from "../../api-lib/auth";
import { auths } from "../../api-lib/middleware";
import { ncOpts } from "../../api-lib/nc";
import nc from "next-connect";
import { NextApiRequest } from "next";
import { SessionStore } from "next-session";
import { getMongoDb } from "@/api-lib/mongodb";
import { findUserWithEmailAndPassword } from "@/api-lib/db";
import { Session } from "next-session/lib/types";

const handler = nc(ncOpts);

handler.use(...auths);

handler.post(
    async (req: NextApiRequest & { user: {} } & { session: Session }, res) => {
        const db = await getMongoDb();
        const user = await findUserWithEmailAndPassword(
            db,
            req.body.email,
            req.body.password
        );

        if (user) {
            req.session.user = user;
            console.log("saved user", user);
        }
        return res.status(200).json({ user });
    }
);

handler.delete(async (req: NextApiRequest & { session: SessionStore }, res) => {
    await req.session.destroy("");
    res.status(204).end();
});

export default handler;
