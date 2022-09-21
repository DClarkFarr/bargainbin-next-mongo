import { NextApiRequest, NextApiResponse } from "next";
import ApiError from "../errors/ApiError";

export const ncOpts = {
    onError(err: ApiError, req: NextApiRequest, res: NextApiResponse) {
        console.error(err);
        res.statusCode =
            err.status && err.status >= 100 && err.status < 600
                ? err.status
                : 500;
        res.json({ message: err.message });
    },
};
