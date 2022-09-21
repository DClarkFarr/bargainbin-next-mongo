import Ajv from "ajv";
import { NextApiRequest, NextApiResponse } from "next";

export function validateBody(schema: object) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
        const valid = validate(req.body);
        if (valid) {
            return next();
        } else {
            const error = validate.errors?.[0];
            return res.status(400).json({
                error: {
                    message: `"${error?.schemaPath.substring(1)}" ${
                        error?.message
                    }`,
                },
            });
        }
    };
}
