import { Db, ObjectId } from "mongodb";
import { dbProjectionUsers } from "./userModel";

export async function findPostById(db: Db, id: string) {
    const posts = await db
        .collection("posts")
        .aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "users",
                    localField: "creatorId",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
        ])
        .toArray();
    if (!posts[0]) return null;
    return posts[0];
}

export async function findPosts(
    db: Db,
    before: Date | undefined,
    by: string,
    limit = 10
) {
    return db
        .collection("posts")
        .aggregate([
            {
                $match: {
                    ...(by && { creatorId: new ObjectId(by) }),
                    ...(before && { createdAt: { $lt: before } }),
                },
            },
            { $sort: { _id: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "creatorId",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            { $unwind: "$creator" },
            { $project: dbProjectionUsers("creator.") },
        ])
        .toArray();
}

export async function insertPost(
    db: Db,
    { content, creatorId }: { content: string; creatorId: string }
) {
    const data = {
        content,
        creatorId,
        createdAt: new Date(),
    };
    const { insertedId } = await db.collection("posts").insertOne(data);

    return {
        _id: insertedId,
        ...data,
    };
}
