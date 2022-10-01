import Link from "next/link";

export type CategoryTab = "list" | "featured" | "clearance";

const CategoryPageTabs = ({ tab }: { tab: CategoryTab }) => {
    const tabs = [
        {
            label: "Imported Categories",
            value: "list",
            selected: tab === "list",
            href: "",
        },
        {
            label: "Assign Featured",
            value: "featured",
            selected: tab === "featured",
            href: "featured",
        },
        {
            label: "Assign Clearance",
            value: "clearance",
            selected: tab === "clearance",
            href: "clearance",
        },
    ];
    return (
        <div className="category-page-tabs">
            <div className="flex gap-4">
                {tabs.map((tab) => {
                    return (
                        <Link
                            href={`/admin/categories/${tab.value}`}
                            key={tab.value}
                        >
                            <a
                                className={`category-link px-4 py-2 bg-gray-200 rounded ${
                                    tab.selected
                                        ? "category-link--selected bg-blue-300"
                                        : ""
                                }`}
                            >
                                {tab.label}
                            </a>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryPageTabs;
