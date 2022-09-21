import Link from "next/link";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useAdminState from "../../hooks/useAdminState";
import { FC } from "../../types/component";
import NotAuthorized from "../GenericPages/NotAuthorized";
import FullLoader from "../Loaders/FullLoader";
import AdminSidebar from "./AdminLayout/AdminSidebar";

export interface AdminLayoutProps extends FC {
    showAuth?: boolean;
    showSidebar?: boolean;
}
const AdminLayout = ({
    showSidebar = true,
    showAuth = true,
    children,
}: AdminLayoutProps) => {
    const { isLoading, admin, logout } = useAdminState();
    const router = useRouter();

    const onLogout = () => {
        logout();
        router.push("/admin/login");
    };
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="admin-layout lg:flex lg:h-[100vh]">
                {showSidebar && (
                    <>
                        <div className="admin-layout__sidebar lg:w-[350px] shrink-0 bg-gray-200">
                            <AdminSidebar admin={admin} onLogout={onLogout} />
                        </div>
                    </>
                )}
                <div className="admin-layout__content relative p-6 lg:h-[100vh] w-full">
                    <FullLoader loading={isLoading}>
                        {(!!admin || (!admin && !showAuth)) && <>{children}</>}
                        {!admin && showAuth && (
                            <NotAuthorized>
                                <Link href="/admin/login">
                                    <a className="btn text-gray-700 underline">
                                        Go To Login
                                    </a>
                                </Link>
                            </NotAuthorized>
                        )}
                    </FullLoader>
                </div>
            </div>
        </DndProvider>
    );
};

export default AdminLayout;
