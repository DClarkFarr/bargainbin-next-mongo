import RegisterPanel from "@/components/Forms/RegisterPanel";
import { useCurrentUser } from "@/lib/user";
import { NextPage } from "next";
import DefaultLayout from "../components/Layouts/Default";
import MetaHead from "../components/Layouts/MetaHead";

const Register: NextPage = () => {
    const { data: user, error } = useCurrentUser();

    return (
        <DefaultLayout>
            <MetaHead title="Create an Account | [base]"></MetaHead>
            <div className="container mx-auto">
                <>
                    {user ? JSON.stringify(user) : "not logged in"}
                    <RegisterPanel />
                </>
            </div>
        </DefaultLayout>
    );
};

export default Register;
