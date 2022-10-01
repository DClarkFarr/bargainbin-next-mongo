import { NextPage } from "next";
import AdminCategoryPageTabs from "@/components/Admin/Category/PageTabs";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { DateTime } from "luxon";
import ItemModel from "@/api-lib/db/itemModel";
import { Item } from "@/types/Item";
import SearchBar, { SearchPairs } from "@/components/Admin/Category/SearchBar";
import { orderBy } from "lodash";
import { useMemo, useState } from "react";
import ProductListItem from "@/components/Admin/Item/ListItem";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const AssignClearancePage: NextPage<{
    items: Item<string>[];
}> = ({ items: dbItems }) => {
    const items = useMemo(() => {
        const mapped = dbItems.map((item) => ({
            ...item,
            createdAt: DateTime.fromISO(item.createdAt),
            syncedAt: DateTime.fromISO(item.syncedAt),
            squareUpdatedAt: DateTime.fromISO(item.squareUpdatedAt),
        }));

        return orderBy(mapped, ["name"], ["asc"]);
    }, [dbItems]);

    const itemPairs = useMemo<SearchPairs[]>(() => {
        return items.map((item) => ({
            id: item.id,
            value: item.name + " " + item.description,
            filter: item.isClearance,
        }));
    }, [items]);

    const [filteredItems, setFilteredItems] = useState(items);

    const onSearchItems = (ids: string[]) => {
        setFilteredItems(items.filter((item) => ids.includes(item.id)));
    };
    const onResetItems = () => {
        setFilteredItems(items);
    };

    return (
        <AdminLayout>
            <h1 className="font-semibold text-2xl mb-4">Categories</h1>
            <div className="mb-6">
                <AdminCategoryPageTabs tab="clearance" />
            </div>
            <div className="mb-6">
                <SearchBar
                    pairs={itemPairs}
                    keyLabel="Clearance"
                    onSearch={onSearchItems}
                    onReset={onResetItems}
                />
            </div>
            <div className="items">
                {filteredItems.map((item) => {
                    return (
                        <ProductListItem item={item} key={item.id}>
                            <div className="flex w-full justify-end">
                                {item.isClearance ? (
                                    <button className="btn btn-sm bg-red-600">
                                        <FontAwesomeIcon
                                            className="mr-2"
                                            icon={solid("times")}
                                        />
                                        Remove from Clearance
                                    </button>
                                ) : (
                                    <button className="btn btn-sm bg-green-600">
                                        <FontAwesomeIcon
                                            className="mr-2"
                                            icon={solid("check")}
                                        />
                                        Add to Clearance
                                    </button>
                                )}
                            </div>
                        </ProductListItem>
                    );
                })}
            </div>
        </AdminLayout>
    );
};

export const getServerSideProps = async () => {
    const itemModel = await ItemModel.factory();

    const items = (await itemModel.collection.find({}).toArray()).map(
        (item) => ({
            ...item,
            id: item._id.toString(),
            createdAt: item.createdAt?.toISOString(),
            syncedAt: item.syncedAt?.toISOString(),
            squareUpdatedAt: item.syncedAt?.toISOString(),
            _id: item._id.toString(),
        })
    );

    return {
        props: {
            items,
        },
    };
};

export default AssignClearancePage;
