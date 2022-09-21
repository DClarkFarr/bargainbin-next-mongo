import { faPaperPlane } from "@fortawesome/pro-light-svg-icons";
import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import useRecpatcha from "../../hooks/useRecaptcha";
import { validateEmail } from "../../methods/validate";
import UserService from "../../services/userService";

const NewsletterSignupBar = () => {
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState("");

    const { token, execute } = useRecpatcha({ defaultAction: "newsletter" });

    const userService = useMemo(() => {
        return new UserService({});
    }, []);

    const isValid = useMemo(() => {
        return validateEmail(email);
    }, [email]);

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await userService.newsletterSignup(token, email);
            setEmail("");
        } catch (err) {
            console.error("caught error", err);
        }

        setSubmitting(false);
        execute();
    };
    return (
        <form method="POST" action="" onSubmit={onSubmit}>
            <div className="newsletter-signup flex">
                <div className="grow">
                    <input
                        type="text"
                        className="form-control rounded-l-full text-gray-500 focus:text-gray-700"
                        placeholder="Your email address"
                        value={email}
                        onChange={onChangeEmail}
                        disabled={submitting}
                    />
                </div>
                <div className="shrink">
                    <button
                        type="submit"
                        className="btn btn-primary rounded-r-full"
                        disabled={submitting || !isValid || !token}
                    >
                        <span className="inline-block pl-1 pr-2 py-[1px]">
                            {!submitting && (
                                <FontAwesomeIcon
                                    icon={faPaperPlane}
                                    size="lg"
                                />
                            )}
                            {submitting && (
                                <FontAwesomeIcon
                                    icon={faCircleNotch}
                                    size="lg"
                                    spin
                                />
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default NewsletterSignupBar;
