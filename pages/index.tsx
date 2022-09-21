import type { NextPage } from "next";
import "../styles/Home.module.scss";

import DefaultLayout from "../components/Layouts/Default";
import MetaHead from "../components/Layouts/MetaHead";

const Home: NextPage = () => {
    return (
        <DefaultLayout>
            <MetaHead title="Home | [base]"></MetaHead>
            <div className="page">
                <h1>Home Page</h1>
            </div>
        </DefaultLayout>
    );
};

export default Home;
