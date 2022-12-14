import { ValidateProps } from "@/api-lib/constants";
import { updateUserPasswordByOldPassword } from "@/api-lib/db";
import { auths, validateBody } from "@/api-lib/middleware";
import { getMongoDb } from "@/api-lib/mongodb";
import { ncOpts } from "@/api-lib/nc";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { Document } from "mongodb";
import { Session } from "next-session/lib/types";

const handler = nc(ncOpts);
handler.use(...auths);

/**
 * Update user password
 */
handler.put(
    validateBody({
        type: "object",
        properties: {
            oldPassword: ValidateProps.user.password,
            newPassword: ValidateProps.user.password,
        },
        required: ["oldPassword", "newPassword"],
        additionalProperties: false,
    }),
    async (
        req: NextApiRequest & { session: Session },
        res: NextApiResponse
    ) => {
        const reqUser = req.session.user;
        if (!reqUser) {
            res.json(401);
            res.end();
            return;
        }

        const db = await getMongoDb();

        const { oldPassword, newPassword } = req.body;

        const success = await updateUserPasswordByOldPassword(
            db,
            reqUser._id,
            oldPassword,
            newPassword
        );

        if (!success) {
            res.status(401).json({
                error: {
                    message: "The old password you entered is incorrect.",
                },
            });
            return;
        }

        res.status(204).end();
    }
);

export default handler;
