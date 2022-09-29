import { Category } from "@/types/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const CategoryListItem = ({
    category,
    onMoveUp,
    onMoveDown,
    setMenuVisible,
}: {
    category: Category;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    setMenuVisible: (id: string, visible: boolean) => void;
}) => {
    return (
        <div className="category-item flex items-center gap-x-4 px-4 py-2 border border-slate-900 rounded-lg mb-2">
            <div className="shrink w-12">
                <div className="category-item__arrows">
                    <div
                        className="category-item__arrow bg-slate-200 text-center cursor-pointer py-[2px] font-base leading-none border border-slate-600 hover:bg-slate-300"
                        onClick={() => onMoveUp(category.id)}
                    >
                        <FontAwesomeIcon icon={solid("caret-up")} />
                    </div>
                    <div
                        className="category-item__arrow bg-slate-200 text-center cursor-pointer py-[2px] font-base leading-none border border-slate-600 hover:bg-slate-300"
                        onClick={() => onMoveDown(category.id)}
                    >
                        <FontAwesomeIcon icon={solid("caret-down")} />
                    </div>
                </div>
            </div>
            <div className="grow">
                <div className="category-item__name">
                    <span className="font-semibold pr-2">{category.name}</span>
                    <span className="text-xs text-gray-500">
                        {category.slug}
                    </span>
                </div>
                <div className="category-item__dates">
                    <span className="pr-3">
                        <small>Created at:</small>
                        {category.createdAt.toFormat("yyyy-MM-dd HH:mm")}
                    </span>
                    <span className="pr-3">
                        <small>Last Square Update:</small>
                        {category.squareUpdatedAt.toFormat("yyyy-MM-dd HH:mm")}
                    </span>
                    <span className="pr-3">
                        <small>Synced at:</small>
                        {category.syncedAt.toFormat("yyyy-MM-dd HH:mm")}
                    </span>
                </div>
            </div>
            <div className="shrink">
                <label className="checkbox bg-gray-200 px-4 py-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={category.showOnMenu}
                        onChange={(e) => {
                            setMenuVisible(category.id, e.target.checked);
                        }}
                    />
                    <span className="text-slate-800 pl-2">Show on menu</span>
                </label>
            </div>
        </div>
    );
};

export default CategoryListItem;
