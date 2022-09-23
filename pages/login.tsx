import { NextPage } from "next";
import DefaultLayout from "../components/Layouts/Default";
import MetaHead from "../components/Layouts/MetaHead";
import LoginPanel from "../components/Forms/LoginPanel";

const Login: NextPage = () => {
    return (
        <DefaultLayout>
            <MetaHead title="Login | [base]"></MetaHead>
            <div className="container mx-auto">
                <div className="login-form-wrap flex flex-col justify-center items-center w-full lg:h-[500px] lg:max-h-[90vh]">
                    <>
                        <LoginPanel />
                    </>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Login;
