import nc from "next-connect";
import { ncOpts } from "@/api-lib/nc";
import session from "@/api-lib/middleware/session";
import isAdmin from "@/api-lib/middleware/isAdmin";
import { NextApiRequest } from "next";
import { Session } from "next-session/lib/types";
import AdminModel from "@/api-lib/db/adminModel";

const handler = nc(ncOpts);

handler.use(session);

/**
 * Get authenticated admin
 */
handler.get(isAdmin, (req, res) => {
    res.json(req.session.admin);
});

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

export default handler;
