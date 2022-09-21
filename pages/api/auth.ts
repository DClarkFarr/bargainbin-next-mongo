import { passport } from "../../api-lib/auth";
import { auths } from "../../api-lib/middleware";
import { ncOpts } from "../../api-lib/nc";
import nc from "next-connect";
import { NextApiRequest } from "next";
import { SessionStore } from "next-session";

const handler = nc(ncOpts);

handler.use(...auths);

handler.post(
    passport.authenticate("local"),
    (req: NextApiRequest & { user: {} }, res) => {
        res.json({ user: req.user });
    }
);

handler.delete(async (req: NextApiRequest & { session: SessionStore }, res) => {
    await req.session.destroy("");
    res.status(204).end();
});

export default handler;
