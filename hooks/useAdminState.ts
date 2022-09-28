import { useQuery, useQueryClient } from "react-query";
import { Admin } from "../types/Admin";
import ApiError from "../errors/ApiError";
import apiClient from "../services/apiClient";
import AdminService from "../services/adminService";

export type LoginProps = {
    setErrors: (errors: string[]) => void;
    email: string;
    password: string;
};

export type RegisterProps = {
    setErrors: (errors: string[]) => void;
    email: string;
    password: string;
    name: string;
};

const adminService = new AdminService({});

const useAdminState = () => {
    const queryClient = useQueryClient();

    const {
        status,
        data: admin,
        error,
        isFetching,
        refetch,
    } = useQuery<any, any, Admin>(
        "admin",
        () => {
            return adminService.getAuthedAdmin();
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
            onError(err: ApiError) {
                if (err.status === 401) {
                    return queryClient.setQueryData("admin", null);
                }
                throw err;
            },
        }
    );

    const login = async ({
        setErrors,
        ...props
    }: LoginProps): Promise<void> => {
        setErrors([]);

        return adminService
            .login(props.email, props.password)
            .then((admin) => {
                queryClient.setQueryData("admin", admin);
            })
            .catch((error) => {
                if (error instanceof ApiError) {
                    setErrors([error.message]);
                }
            });
    };

    const logout = async () => {
        await adminService.logout();

        queryClient.setQueryData("admin", null);
    };

    return {
        admin,
        login,
        logout,
        refetch,
        error,
        isLoading: isFetching,
    };
};

export default useAdminState;
