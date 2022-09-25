import { ValidateProps } from "../../../api-lib/constants";
import UserModel, {
    UserDocument,
    UserUpdateable,
} from "../../../api-lib/db/userModel";
import { auths, validateBody } from "../../../api-lib/middleware";
import { ncOpts } from "@/api-lib/nc";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { WithId } from "mongodb";
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

/**
 * Get current user
 */
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

/**
 * Update user
 */
handler.patch(
    upload.single("profilePicture"),
    validateBody({
        type: "object",
        properties: {
            name: ValidateProps.user.name,
        },
        additionalProperties: true,
    }),
    async (req, res) => {
        const r = req as unknown as NextApiRequest & { session: Session };

        if (!r.session.user) {
            res.status(401).end();
            return;
        }

        const userModel = await UserModel.factory();

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

        const { name } = req.body;

        const reqUser = r.session.user as WithId<UserDocument>;

        const toSet: UserUpdateable = {
            name,
            profilePicture,
        };

        const user = await userModel.updateById(reqUser._id.toString(), toSet);
        if (user) {
            res.json({ user: userModel.toArray(user) });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
);

/**
 * signup
 */
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
        const userModel = await UserModel.factory();

        let { name, email, password } = req.body;

        if (!isEmail(email)) {
            res.status(400).json({
                error: { message: "The email you entered is invalid." },
            });
            return;
        }

        if (await userModel.findByEmail(email)) {
            res.status(403).json({
                error: { message: "The email has already been used." },
            });
            return;
        }

        const user = await userModel.create({
            email,
            password,
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
