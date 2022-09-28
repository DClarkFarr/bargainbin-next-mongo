import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import MetaHead from "../../components/Layouts/MetaHead";
import useAdminState from "../../hooks/useAdminState";

const AdminLogin: NextPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAdminState();

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onSubmit = () => {
        setError("");
        login({
            email,
            password,
        })
            .then(() => {
                const redir = (router.query.redir || "") as string;
                if (redir) {
                    router.push(redir);
                } else {
                    router.push("/admin");
                }
            })
            .catch((err) => {
                if (err instanceof Error) {
                    setError(err.message);
                }
            });
    };

    return (
        <AdminLayout showAuth={false} showSidebar={false}>
            <MetaHead title="Login | Admin"></MetaHead>
            <div className="container mx-auto">
                <div className="login-form-wrap flex flex-col justify-center items-center w-full lg:h-[500px] lg:max-h-[90vh]">
                    <div className="login-form lg:w-[450px] lg:max-w-full mx-auto">
                        <h3 className="text-2xl mb-4">Admin Login</h3>
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

                        {error.length > 0 && (
                            <div className="text-red-700 mb-4">{error}</div>
                        )}

                        <div className="pt-4">
                            <button
                                className="btn bg-green-700"
                                onClick={onSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminLogin;
