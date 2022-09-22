import { ValidateProps } from "../../../api-lib/constants";
import {
    updateUserById,
    findUserByEmail,
    insertUser,
} from "../../../api-lib/db";
import { auths, validateBody } from "../../../api-lib/middleware";
import { getMongoDb } from "@/api-lib/mongodb";
import { ncOpts } from "@/api-lib/nc";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "mongodb";
import normalizeEmail from "validator/lib/normalizeEmail";
import isEmail from "validator/lib/isEmail";
import { Session } from "next-session/lib/types";

const upload = multer({ dest: "/tmp" });
const handler = nc(ncOpts);

if (process.env.CLOUDINARY_URL) {
    const {
        hostname: cloud_name,
        username: api_key,
        password: api_secret,
    } = new URL(process.env.CLOUDINARY_URL);

    cloudinary.config({
        cloud_name,
        api_key,
        api_secret,
    });
}

handler.use(...auths);

handler.get(
    async (
        req: NextApiRequest & { session: Session },
        res: NextApiResponse
    ) => {
        if (!req.session.user) {
            return res.json(null);
        }
        return res.json({ user: req.session.user });
    }
);

handler.patch(
    upload.single("profilePicture"),
    validateBody({
        type: "object",
        properties: {
            name: ValidateProps.user.name,
            bio: ValidateProps.user.bio,
        },
        additionalProperties: true,
    }),
    async (req, res) => {
        const r = req as unknown as NextApiRequest & { session: Session };

        if (!r.session.user) {
            res.status(401).end();
            return;
        }

        const db = await getMongoDb();

        let profilePicture;
        const documentFile = (req as Express.Request).file;

        if (documentFile) {
            const image = await cloudinary.uploader.upload(documentFile.path, {
                width: 512,
                height: 512,
                crop: "fill",
            });
            profilePicture = image.secure_url;
        }
        const { name, bio } = req.body;

        const reqUser = r.session.user as Document;

        if (await findUserByEmail(db, req.body.email)) {
            res.status(403).json({
                error: { message: "The email has already been taken." },
            });
            return;
        }

        const user = await updateUserById(db, reqUser._id, {
            ...(name && { name }),
            ...(typeof bio === "string" && { bio }),
            ...(profilePicture && { profilePicture }),
        });

        res.json({ user });
    }
);

handler.post<NextApiRequest & { session: Session }>(
    validateBody({
        type: "object",
        properties: {
            name: ValidateProps.user.name,
            password: ValidateProps.user.password,
            email: ValidateProps.user.email,
        },
        required: ["name", "password", "email"],
        additionalProperties: false,
    }),
    async (req, res) => {
        const db = await getMongoDb();

        let { name, email, password } = req.body;
        email = normalizeEmail(req.body.email);

        if (!isEmail(email)) {
            res.status(400).json({
                error: { message: "The email you entered is invalid." },
            });
            return;
        }
        if (await findUserByEmail(db, email)) {
            res.status(403).json({
                error: { message: "The email has already been used." },
            });
            return;
        }

        const user = await insertUser(db, {
            email,
            originalPassword: password,
            bio: "",
            name,
        });

        req.session.user = user;

        return res.json({ user });
    }
);

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

export default handler;
