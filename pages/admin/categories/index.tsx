import CategoryModel from "@/api-lib/db/categoryModel";
import AdminCategoryList from "@/components/Admin/Category/List";
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminCategoryPageTabs from "@/components/Admin/Category/PageTabs";
import { DateTime } from "luxon";
import { NextPage } from "next";
import { Category } from "../../../types/Category";

const CategoriesPage: NextPage<{
    categories: Category<string>[];
}> = ({ categories: dbCategories }) => {
    const categories = dbCategories.map((category) => {
        return {
            ...category,
            squareUpdatedAt: DateTime.fromISO(category.squareUpdatedAt),
            createdAt: DateTime.fromISO(category.createdAt),
            syncedAt: DateTime.fromISO(category.syncedAt),
        };
    });
    return (
        <AdminLayout>
            <div className="categories-page">
                <h1 className="font-semibold text-2xl mb-4">Categories</h1>
                <div className="mb-6">
                    <AdminCategoryPageTabs tab="list" />
                </div>
                <AdminCategoryList categories={categories} />
            </div>
        </AdminLayout>
    );
};

export const getServerSideProps = async () => {
    const categoryModel = await CategoryModel.factory();

    const categories = (
        await categoryModel.collection
            .find(
                {},
                {
                    sort: {
                        menuOrder: 1,
                    },
                }
            )
            .toArray()
    ).map(({ _id, ...category }) => {
        return {
            ...category,
            squareUpdatedAt: category.squareUpdatedAt?.toISOString(),
            createdAt: category.createdAt?.toISOString(),
            syncedAt: category.syncedAt?.toISOString(),
            id: _id.toString(),
        };
    });

    return {
        props: {
            categories,
        },
    };
};

export default CategoriesPage;
