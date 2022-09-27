import nc from "next-connect";
import { ncOpts } from "@/api-lib/nc";
import SquareService from "@/api-lib/services/SquareService";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const handler = nc(ncOpts);

handler.get(async (req, res) => {
    const squareService = new SquareService();

    const results = await squareService.syncCatalog();

    res.json({ ...results });
});

export default handler;
