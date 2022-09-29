import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import "../styles/Home.module.scss";

import DefaultLayout from "../components/Layouts/Default";
import MetaHead from "../components/Layouts/MetaHead";
import CategoryModel from "@/api-lib/db/categoryModel";
import useSiteState from "hooks/useSiteState";
import { Category } from "@/types/Category";

const Home: NextPage<{
    categories: Category<string>[];
}> = ({ categories }) => {
    const site = useSiteState();

    site.setCategories(categories);
    return (
        <DefaultLayout>
            <MetaHead title="Home | [base]"></MetaHead>
            <div className="page">
                <h1>Home Page</h1>
            </div>
        </DefaultLayout>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const categoryModel = await CategoryModel.factory();
    const categories = await categoryModel.getSiteCategories();
    return {
        props: {
            categories,
        },
        revalidate: 300, // seconds
    };
};

export default Home;
