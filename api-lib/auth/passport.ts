import { findUserForAuth, findUserWithEmailAndPassword } from "../db";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getMongoDb } from "../mongodb";
import { NextApiRequest } from "next";
import { Document, WithId } from "mongodb";

passport.serializeUser((user, done) => {
    done(null, (user as { _id: string })._id);
});

passport.deserializeUser(
    (
        req: NextApiRequest,
        id: string,
        done: (err: any, user?: WithId<Document> | null) => void
    ) => {
        getMongoDb().then((db) => {
            findUserForAuth(db, id).then(
                (user) => done(null, user),
                (err) => done(err)
            );
        });
    }
);

passport.use(
    new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
            const db = await getMongoDb();
            const user = await findUserWithEmailAndPassword(
                db,
                email,
                password
            );
            if (user) {
                done(null, user);
            } else {
                done({ message: "Email/password not found" }, false, {
                    message: "Another message",
                });
            }
        }
    )
);

export default passport;
