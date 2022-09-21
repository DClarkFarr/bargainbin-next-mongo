import bcrypt from "bcryptjs";
import { Db, ObjectId } from "mongodb";
import normalizeEmail from "validator/lib/normalizeEmail";

export async function findUserWithEmailAndPassword(
    db: Db,
    email: string,
    password: string
) {
    const normEmail = normalizeEmail(email);
    if (!normEmail) {
        throw new Error("Failed to normalize email");
    }
    const user = await db.collection("users").findOne({ email: normEmail });
    if (user && (await bcrypt.compare(password, user.password))) {
        return { ...user, password: undefined }; // filtered out password
    }
    return null;
}

export async function findUserForAuth(db: Db, userId: string) {
    return db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
        .then((user) => user || null);
}

export async function findUserById(db: Db, userId: string) {
    return db
        .collection("users")
        .findOne(
            { _id: new ObjectId(userId) },
            { projection: dbProjectionUsers() }
        )
        .then((user) => user || null);
}

export async function findUserByUsername(db: Db, username: string) {
    return db
        .collection("users")
        .findOne({ username }, { projection: dbProjectionUsers() })
        .then((user) => user || null);
}

export async function findUserByEmail(db: Db, email: string) {
    const normEmail = normalizeEmail(email);
    if (!normEmail) {
        throw new Error("Failed to normalize email");
    }
    return db
        .collection("users")
        .findOne({ email: normEmail }, { projection: dbProjectionUsers() })
        .then((user) => user || null);
}

export async function updateUserById(
    db: Db,
    id: string,
    data:
        | Readonly<
              {
                  [x: string]: unknown;
              } & {} & {}
          >
        | undefined
) {
    return db
        .collection("users")
        .findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: "after", projection: { password: 0 } }
        )
        .then(({ value }) => value);
}

export async function insertUser(
    db: Db,
    {
        email,
        originalPassword,
        bio = "",
        name,
        profilePicture,
        username,
    }: {
        email: string;
        originalPassword: string;
        bio?: string;
        name: string;
        profilePicture: string;
        username: string;
    }
) {
    const user = {
        emailVerified: false,
        profilePicture,
        email,
        name,
        username,
        bio,
    };
    const password = await bcrypt.hash(originalPassword, 10);
    const { insertedId } = await db
        .collection("users")
        .insertOne({ ...user, password });
    return {
        ...user,
        _id: insertedId,
    };
}

export async function updateUserPasswordByOldPassword(
    db: Db,
    id: string,
    oldPassword: string,
    newPassword: string
) {
    const user = await db.collection("users").findOne(new ObjectId(id));
    if (!user) return false;
    const matched = await bcrypt.compare(oldPassword, user.password);
    if (!matched) return false;
    const password = await bcrypt.hash(newPassword, 10);
    await db
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
    return true;
}

export async function UNSAFE_updateUserPassword(
    db: Db,
    id: string,
    newPassword: string
) {
    const password = await bcrypt.hash(newPassword, 10);
    await db
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

export function dbProjectionUsers(prefix = "") {
    return {
        [`${prefix}password`]: 0,
        [`${prefix}email`]: 0,
        [`${prefix}emailVerified`]: 0,
    };
}
