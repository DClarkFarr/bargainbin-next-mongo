import { Db, ObjectId } from "mongodb";
import { nanoid } from "nanoid";

export function findTokenByIdAndType(db: Db, id: string, type: string) {
    return db.collection("tokens").findOne({
        _id: id,
        type,
    });
}

export function findAndDeleteTokenByIdAndType(
    db: Db,
    id: string,
    type: string
) {
    return db
        .collection("tokens")
        .findOneAndDelete({ _id: id, type })
        .then(({ value }) => value);
}

export async function createToken(
    db: Db,
    {
        creatorId,
        type,
        expireAt,
    }: { creatorId: string; type: string; expireAt: Date }
) {
    const securedTokenId = nanoid(32);
    const token = {
        _id: new ObjectId(securedTokenId),
        creatorId,
        type,
        expireAt,
    };
    await db.collection("tokens").insertOne(token);
    return token;
}
