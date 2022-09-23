import RegisterPanel from "@/components/Forms/RegisterPanel";
import { NextPage } from "next";
import DefaultLayout from "../components/Layouts/Default";
import MetaHead from "../components/Layouts/MetaHead";

const Register: NextPage = () => {
    return (
        <DefaultLayout>
            <MetaHead title="Create an Account | [base]"></MetaHead>
            <div className="container mx-auto">
                <RegisterPanel />
            </div>
        </DefaultLayout>
    );
};

export default Register;
