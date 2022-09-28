import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-session/lib/types";

export default async function isAdmin(
    req: NextApiRequest & { session: Session },
    res: NextApiResponse,
    next: () => void
) {
    if (!req.session) {
        return res.status(401).json({ message: "Session not instantiated" });
    }

    if (!req.session.admin) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    next();
}
