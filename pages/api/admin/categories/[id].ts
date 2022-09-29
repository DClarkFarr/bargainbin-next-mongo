import { ncOpts } from "@/api-lib/nc";
import nc from "next-connect";
import session from "@/api-lib/middleware/session";
import isAdmin from "@/api-lib/middleware/isAdmin";
import CategoryModel from "@/api-lib/db/categoryModel";
import { ObjectId } from "mongodb";
import { pick } from "lodash";

const handler = nc(ncOpts);

handler.use(session, isAdmin);

handler.put(async (req, res) => {
    const toSet = pick(req.body, ["menuOrder", "showOnMenu"]);

    const categoryModel = await CategoryModel.factory();

    const { value: category } = await categoryModel.collection.findOneAndUpdate(
        {
            _id: new ObjectId(req.query.id as string),
        },
        {
            $set: toSet,
        }
    );

    res.json({ category });
});

export default handler;
