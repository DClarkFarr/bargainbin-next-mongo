import { createToken } from "@/api-lib/db";
// import { CONFIG as MAIL_CONFIG, sendMail } from "@/api-lib/mail";
import { auths } from "@/api-lib/middleware";
import { getMongoDb } from "@/api-lib/mongodb";
import { ncOpts } from "@/api-lib/nc";
import { Document } from "mongodb";
import { NextApiRequest } from "next";
import nc from "next-connect";
import { Session } from "next-session/lib/types";

const handler = nc(ncOpts);

handler.use(...auths);

handler.post<NextApiRequest & { session: Session }>(async (req, res) => {
    if (!req.session.user) {
        res.json(401);
        res.end();
        return;
    }

    const db = await getMongoDb();

    const token = await createToken(db, {
        creatorId: req.session.user._id,
        type: "emailVerify",
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    /*
    await sendMail({
        to: req.session.user.email,
        from: MAIL_CONFIG.from,
        subject: `Verification Email for ${process.env.WEB_URI}`,
        html: `
        <div>
            <p>Hello, ${req.session.user.name}</p>
            <p>Please follow <a href="${process.env.WEB_URI}/verify-email/${token._id}">this link</a> to confirm your email.</p>
        </div>
        `,
    });
    */

    console.log("TODO: Send email with link to verify email", token);

    res.status(204).end();
});

export default handler;
