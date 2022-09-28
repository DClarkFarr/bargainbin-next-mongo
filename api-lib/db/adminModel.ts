import bcrypt from "bcryptjs";
import { ObjectId, Document, WithId, FindOptions, Db } from "mongodb";
import normalizeEmail from "validator/lib/normalizeEmail";
import { getMongoDb } from "../mongodb";
import BaseModel from "./baseModel";

type WithPassword<D extends Document = Document> = D & { password: string };

export interface AdminDocument extends Document {
    name: string;
    email: string;
    emailVerified: boolean;
    profilePicture: string | null;
}

type AdminProjectionPresets = "auth" | "default";

export type AdminUpdateable = Partial<
    Pick<AdminDocument, "name" | "profilePicture">
>;

export type AdminCreateable = WithPassword<
    Pick<AdminDocument, "name" | "email">
> &
    Partial<Pick<AdminDocument, "emailVerified" | "profilePicture">>;

class AdminModel extends BaseModel<
    AdminDocument,
    AdminProjectionPresets,
    AdminUpdateable
> {
    constructor(db: Db) {
        super(db);
        this.collectionName = "admins";
        this.collection = this.getCollection();
    }

    static async factory() {
        const db = await getMongoDb();
        return new this(db);
    }

    getProjection(
        obj: FindOptions["projection"] = {},
        preset?: AdminProjectionPresets
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
        options: FindOptions<AdminDocument> & {
            preset?: AdminProjectionPresets;
        } = {}
    ) {
        const normEmail = normalizeEmail(email);

        if (!normEmail) {
            throw new Error("Failed to normalize email");
        }
        return this.findOne({ email: normEmail }, options);
    }

    async findWithEmailAndPassword(email: string, password: string) {
        const admin = (await this.findByEmail(email, {
            preset: "auth",
        })) as WithPassword<WithId<AdminDocument>>;

        if (admin && (await bcrypt.compare(password, admin.password))) {
            return this.toArray(admin); // filtered out password
        }
        return null;
    }

    async create({
        email,
        password: originalPassword,
        name,
        profilePicture = null,
        emailVerified = false,
    }: AdminCreateable): Promise<WithId<AdminDocument>> {
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
        const admin = await this.findOne(new ObjectId(id));
        if (!admin) return false;

        const matched = await bcrypt.compare(oldPassword, admin.password);
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

    toArray(d: WithId<AdminDocument>) {
        const obj = { ...d };

        delete obj.password;

        return obj as WithId<AdminDocument>;
    }
}

export default AdminModel;
