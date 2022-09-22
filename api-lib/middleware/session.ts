import { getMongoClient } from "../mongodb";
import MongoStore from "connect-mongo";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-session/lib/types";

const mongoStore = MongoStore.create({
    clientPromise: getMongoClient(),
    stringify: false,
});

const getSession = nextSession({
    store: promisifyStore(mongoStore),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 7 * 24 * 60 * 60, // 2 weeks,
        path: "/",
        sameSite: "strict",
    },
    touchAfter: 1 * 7 * 24 * 60 * 60, // 1 week
});

export default async function session(
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
) {
    await getSession(req, res);

    const r = req as NextApiRequest & { session: Session };
    r.session.regenerate = async () => {
        console.log("NOOOOOOOOO");
    };

    next();
}
