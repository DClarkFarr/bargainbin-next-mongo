import useUserState from "hooks/useUserState";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

const RegisterPanel = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const { register } = useUserState();

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
        register({ name, email, password })
            .then(() => {
                router.push("/");
            })
            .catch((err) => {
                if (err instanceof Error) {
                    console.warn("Caught error on register", err);
                }
            });
    };

    return (
        <div className="register-form-wrap flex flex-col justify-center items-center w-full lg:h-[500px] lg:max-h-[90vh]">
            <div className="register-form lg:w-[450px] lg:max-w-full mx-auto">
                <h2 className="text-2xl">Register Form</h2>
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
                    <button className="btn bg-green-700" onClick={onSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPanel;
