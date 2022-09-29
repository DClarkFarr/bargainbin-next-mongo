import { Category } from "@/types/Category";
import { useState } from "react";
import AdminService from "@/services/adminService";
import CategoryListItem from "./CategoryListItem";

const adminService = new AdminService({});

const AdminCategoryList = ({
    categories: defaultCategories,
}: {
    categories: Category[];
}) => {
    const [categories, setCategories] = useState(defaultCategories);

    /*
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    setMenuVisible: (id: string, visible: boolean) => void;
    */

    const updateCategorySorts = (cats: Category[]) => {
        const mapped = cats.map((c, i) => {
            return {
                ...c,
                menuOrder: i,
            };
        });

        setCategories(mapped);
        const categoryIds = cats.map((category) => category.id);
        adminService.updateCategorySorts(categoryIds);
    };

    const onMoveUp = (id: string) => {
        const index = categories.findIndex((category) => category.id === id);
        if (index < 1) {
            return;
        }
        const cats = [...categories];
        cats.splice(index, 1);
        cats.splice(index - 1, 0, categories[index]);

        updateCategorySorts(cats);
    };

    const onMoveDown = (id: string) => {
        const index = categories.findIndex((category) => category.id === id);
        if (index > categories.length - 2) {
            return;
        }
        const cats = [...categories];
        cats.splice(index, 1);
        cats.splice(index + 1, 0, categories[index]);

        updateCategorySorts(cats);
    };

    const setMenuVisible = (id: string, visible: boolean) => {
        const index = categories.findIndex((category) => category.id === id);
        const cats = [...categories];
        cats[index].showOnMenu = visible;
        setCategories(cats);
        adminService.updateCategory(id, { showOnMenu: visible });
    };

    return (
        <div className="categories-list">
            {categories.map((category) => {
                return (
                    <div className="category-list__item" key={category.id}>
                        <CategoryListItem
                            category={category}
                            onMoveUp={onMoveUp}
                            onMoveDown={onMoveDown}
                            setMenuVisible={setMenuVisible}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default AdminCategoryList;
