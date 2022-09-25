import bcrypt from "bcryptjs";
import {
    ObjectId,
    Document,
    WithId,
    FindOptions,
    FindOneAndUpdateOptions,
} from "mongodb";
import normalizeEmail from "validator/lib/normalizeEmail";
import { getMongoDb } from "../mongodb";
import BaseModel from "./baseModel";

type WithPassword<D extends Document = Document> = D & { password: string };

export interface UserDocument extends Document {
    name: string;
    email: string;
    emailVerified: boolean;
    profilePicture: string | null;
}

type UserProjectionPresets = "auth" | "default";

export type UserUpdateable = Partial<
    Pick<UserDocument, "name" | "profilePicture">
>;

export type UserCreateable = WithPassword<
    Pick<UserDocument, "name" | "email">
> &
    Partial<Pick<UserDocument, "emailVerified" | "profilePicture">>;

class UserModel extends BaseModel<
    UserDocument,
    UserProjectionPresets,
    UserUpdateable
> {
    collectionName = "users";

    static async factory() {
        const db = await getMongoDb();
        return new this(db);
    }

    getProjection(
        obj: FindOptions["projection"] = {},
        preset?: UserProjectionPresets
    ) {
        if (preset) {
            switch (preset) {
                case "auth":
                    obj = {
                        ...obj,
                        password: 1,
                    };
                    break;
                default:
                    obj = {
                        ...obj,
                        password: 0,
                    };
                    break;
            }
        }

        return obj;
    }

    async findByEmail(
        email: string,
        options: FindOptions<UserDocument> & {
            preset?: UserProjectionPresets;
        } = {}
    ) {
        const normEmail = normalizeEmail(email);

        if (!normEmail) {
            throw new Error("Failed to normalize email");
        }
        return this.findOne({ email: normEmail }, options);
    }

    async findWithEmailAndPassword(email: string, password: string) {
        const user = (await this.findByEmail(email, {
            preset: "auth",
        })) as WithPassword<WithId<UserDocument>>;

        if (user && (await bcrypt.compare(password, user.password))) {
            return this.toArray(user); // filtered out password
        }
        return null;
    }

    async create({
        email,
        password: originalPassword,
        name,
        profilePicture = null,
        emailVerified = false,
    }: UserCreateable): Promise<WithId<UserDocument>> {
        const emailNorm = normalizeEmail(email);
        if (!emailNorm) {
            throw new Error("Failed to normalize email");
        }

        const password = await bcrypt.hash(originalPassword, 10);

        const toSet = {
            email: emailNorm,
            name,
            password,
            profilePicture,
            emailVerified,
        };

        const { insertedId } = await this.collection.insertOne(toSet);

        return this.toArray({
            ...toSet,
            _id: insertedId,
        });
    }

    async updatePasswordByOldPassword(
        id: string,
        oldPassword: string,
        newPassword: string
    ) {
        const user = await this.findOne(new ObjectId(id));
        if (!user) return false;

        const matched = await bcrypt.compare(oldPassword, user.password);
        if (!matched) return false;

        const password = await bcrypt.hash(newPassword, 10);
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { password } }
        );

        return true;
    }

    async updatePassword(id: string, newPassword: string) {
        const password = await bcrypt.hash(newPassword, 10);
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { password } }
        );
    }
}

export default UserModel;

export function dbProjectionUsers(prefix = "") {
    return {
        [`${prefix}password`]: 0,
        [`${prefix}email`]: 0,
        [`${prefix}emailVerified`]: 0,
    };
}
