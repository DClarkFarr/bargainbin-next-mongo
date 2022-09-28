import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import MetaHead from "../../components/Layouts/MetaHead";
import useAdminState from "../../hooks/useAdminState";

const AdminRegister: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const { register } = useAdminState();

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onSubmit = async () => {
        setErrors([]);
        register({ email, password, name })
            .then(() => {
                router.push("/admin");
            })
            .catch((err) => {
                if (err instanceof Error) {
                    setErrors([err.message]);
                }
            });
    };

    return (
        <AdminLayout showSidebar={false} showAuth={false} isAuthPage={false}>
            <MetaHead title="Create an Account | [base]"></MetaHead>
            <div className="container mx-auto">
                <div className="register-form-wrap flex flex-col justify-center items-center w-full lg:h-[500px] lg:max-h-[90vh]">
                    <div className="register-form lg:w-[450px] lg:max-w-full mx-auto">
                        <h2 className="text-2xl">Admin Register</h2>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={onChangeName}
                            />
                        </div>
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

export default AdminRegister;
