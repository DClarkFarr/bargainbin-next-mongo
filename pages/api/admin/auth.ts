import nc from "next-connect";
import { ncOpts } from "@/api-lib/nc";
import session from "@/api-lib/middleware/session";
import isAdmin from "@/api-lib/middleware/isAdmin";

const handler = nc(ncOpts);

handler.use(session);

/**
 * Get authenticated admin
 */
handler.get(isAdmin, (req, res) => {
    res.json(req.session.admin);
});

export default handler;
