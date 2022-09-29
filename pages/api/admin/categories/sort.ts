import { ncOpts } from "@/api-lib/nc";
import nc from "next-connect";
import session from "@/api-lib/middleware/session";
import isAdmin from "@/api-lib/middleware/isAdmin";
import CategoryModel from "@/api-lib/db/categoryModel";
import { ObjectId } from "mongodb";

const handler = nc(ncOpts);

handler.use(session, isAdmin);

handler.post(async (req, res) => {
    const { categoryIds } = req.body;

    const categoryModel = await CategoryModel.factory();

    await Promise.all(
        categoryIds.map(async (categoryId: string, index: number) => {
            await categoryModel.collection.updateOne(
                { _id: new ObjectId(categoryId) },
                { $set: { menuOrder: index } }
            );
        })
    );

    res.json({ updated: true });
});

export default handler;
