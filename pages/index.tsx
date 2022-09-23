import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import "../styles/Home.module.scss";

import DefaultLayout from "../components/Layouts/Default";
import MetaHead from "../components/Layouts/MetaHead";

const Home: NextPage<{
    serverMessage: string;
    staticMessage: string;
}> = (props) => {
    return (
        <DefaultLayout>
            <MetaHead title="Home | [base]"></MetaHead>
            <div className="page">
                <h1>Home Page</h1>
                <p>server: {props.serverMessage}</p>
                <p>static: {props.staticMessage}</p>
            </div>
        </DefaultLayout>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            staticMessage: "this is from the static",
        },
    };
};

export default Home;
