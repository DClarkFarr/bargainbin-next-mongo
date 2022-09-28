import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import useAdminState from "../../hooks/useAdminState";

const AdminDashboard: NextPage = () => {
    return <AdminLayout>Dashboard Content</AdminLayout>;
};

export default AdminDashboard;
