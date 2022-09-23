import { ValidateProps } from "@/api-lib/constants";
import { createToken, findAndDeleteTokenByIdAndType } from "@/api-lib/db";
import UserModel from "@/api-lib/db/user";
import { validateBody } from "@/api-lib/middleware";
import { getMongoDb } from "@/api-lib/mongodb";
import { ncOpts } from "@/api-lib/nc";
import nc from "next-connect";

const handler = nc(ncOpts);

handler.post(
    validateBody({
        type: "object",
        properties: {
            email: ValidateProps.user.email,
        },
        required: ["email"],
        additionalProperties: false,
    }),
    async (req, res) => {
        const userModel = await UserModel.factory();
        const db = await getMongoDb();

        const user = await userModel.findByEmail(req.body.email);
        if (!user) {
            res.status(400).json({
                error: {
                    message: "We couldn’t find that email. Please try again.",
                },
            });
            return;
        }

        const token = await createToken(db, {
            creatorId: user._id.toString(),
            type: "passwordReset",
            expireAt: new Date(Date.now() + 1000 * 60 * 20),
        });

        /*
        await sendMail({
            to: email,
            from: MAIL_CONFIG.from,
            subject: "[nextjs-mongodb-app] Reset your password.",
            html: `
        <div>
            <p>Hello, ${user.name}</p>
            <p>Please follow <a href="${process.env.WEB_URI}/forget-password/${token._id}">this link</a> to reset your password.</p>
        </div>
        `,
        });
        */
        console.log("TODO: Send email with link to reset password");

        res.status(204).end();
    }
);

handler.put(
    validateBody({
        type: "object",
        properties: {
            password: ValidateProps.user.password,
            token: { type: "string", minLength: 0 },
        },
        required: ["password", "token"],
        additionalProperties: false,
    }),
    async (req, res) => {
        const db = await getMongoDb();
        const userModel = await UserModel.factory();

        const deletedToken = await findAndDeleteTokenByIdAndType(
            db,
            req.body.token,
            "passwordReset"
        );
        if (!deletedToken) {
            res.status(403).end();
            return;
        }

        await userModel.updatePassword(
            deletedToken.creatorId,
            req.body.password
        );

        res.status(204).end();
    }
);

export default handler;
