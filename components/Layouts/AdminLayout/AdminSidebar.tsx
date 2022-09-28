import {
    faCartShopping,
    faFileInvoice,
    faHouse,
    faMemo,
    faRightFromBracket,
    faShirt,
    faTags,
    faUser,
} from "@fortawesome/pro-solid-svg-icons";
import { Admin } from "../../../types/Admin";
import NavItem from "./NavItem";

export type AdminSidebarProps = {
    admin?: Admin;
    onLogout: () => void;
};
const AdminSidebar = ({ admin, onLogout }: AdminSidebarProps) => {
    const onClickLogout = () => {
        onLogout();
    };
    return (
        <div className="sidebar">
            {admin && (
                <>
                    <div className="sidebar__profile text-center p-4 mb-10">
                        <div className="text-lg mb-1">{admin.name}</div>
                    </div>
                </>
            )}
            <div className="sidebar__links mb-10">
                <NavItem href="/admin/" icon={faHouse} exact>
                    Dashboard
                </NavItem>
                <NavItem href="/admin/categories" icon={faTags}>
                    Categories
                </NavItem>
                <NavItem href="/admin/products" icon={faShirt}>
                    Products
                </NavItem>
                <NavItem href="/admin/orders" icon={faFileInvoice}>
                    Orders
                </NavItem>
                <NavItem href="/admin/carts" icon={faCartShopping}>
                    Carts
                </NavItem>
                <NavItem href="/admin/users" icon={faUser}>
                    Users
                </NavItem>
                <NavItem href="/admin/settings/pages" icon={faMemo}>
                    Site Content
                </NavItem>
                {!!admin && (
                    <NavItem onClick={onClickLogout} icon={faRightFromBracket}>
                        Logout
                    </NavItem>
                )}
            </div>
        </div>
    );
};

export default AdminSidebar;
