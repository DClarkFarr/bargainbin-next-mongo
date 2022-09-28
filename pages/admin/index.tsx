import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import useAdminState from "../../hooks/useAdminState";

const AdminDashboard: NextPage = () => {
    const { isLoading, admin } = useAdminState();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !admin) {
            router.push("/admin/login");
        }
        // eslint-disable-next-line
    }, [isLoading]);

    return <AdminLayout>Dashboard Content</AdminLayout>;
};

export default AdminDashboard;
