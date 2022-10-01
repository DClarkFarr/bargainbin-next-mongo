import { NextPage } from "next";
import AdminCategoryPageTabs from "@/components/Admin/Category/PageTabs";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { DateTime } from "luxon";
import ItemModel from "@/api-lib/db/itemModel";
import { Item } from "@/types/Item";

const AssignClearancePage: NextPage<{
    items: Item<string>[];
}> = ({ items: dbItems }) => {
    const items = dbItems.map((item) => ({
        ...item,
        createdAt: DateTime.fromISO(item.createdAt),
        syncedAt: DateTime.fromISO(item.syncedAt),
        squareUpdatedAt: DateTime.fromISO(item.squareUpdatedAt),
    }));

    console.log("got items", items);

    return (
        <AdminLayout>
            <h1 className="font-semibold text-2xl mb-4">Categories</h1>
            <div className="mb-6">
                <AdminCategoryPageTabs tab="clearance" />
            </div>
        </AdminLayout>
    );
};

export const getServerSideProps = async () => {
    const itemModel = await ItemModel.factory();

    const items = (await itemModel.collection.find({}).toArray()).map(
        (item) => ({
            ...item,
            _id: item._id.toString(),
            createdAt: item.createdAt?.toISOString(),
            syncedAt: item.syncedAt?.toISOString(),
            squareUpdatedAt: item.syncedAt?.toISOString(),
        })
    );

    return {
        props: {
            items,
        },
    };
};

export default AssignClearancePage;
