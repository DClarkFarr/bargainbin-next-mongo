import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import useUserState from "../../hooks/useUserState";

const LoginPanel = ({
    onSuccess,
    redirect = true,
}: {
    redirect?: boolean;
    onSuccess?: () => void;
}) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const { login } = useUserState();

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        login({
            email,
            password,
        })
            .then(() => {
                if (typeof onSuccess === "function") {
                    onSuccess();
                }
                const redir = (router.query.redir || "") as string;
                if (redirect) {
                    if (redir) {
                        router.push(redir);
                    } else {
                        router.push("/");
                    }
                }
            })
            .catch((err) => {
                if (err instanceof Error) {
                    setErrors([err.message]);
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <form
            className="login-form lg:w-[450px] lg:max-w-full mx-auto"
            onSubmit={onSubmit}
        >
            <h3 className="text-2xl mb-4">Login Form</h3>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={onChangeEmail}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={onChangePassword}
                />
            </div>

            {errors.map((error, i) => {
                return (
                    <div className="text-red-700 mb-4" key={i}>
                        {error}
                    </div>
                );
            })}

            <div className="pt-4">
                <button
                    className="btn bg-green-700"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                        </>
                    ) : (
                        "Log in"
                    )}
                </button>
            </div>
        </form>
    );
};

export default LoginPanel;
