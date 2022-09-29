import { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import ApiError from "../errors/ApiError";
import apiClient from "../services/apiClient";
import UserService from "../services/userService";
import { User } from "../types/User";

export type LoginProps = {
    email: string;
    password: string;
};
export type RegisterProps = {
    email: string;
    password: string;
    name: string;
};

const userService = new UserService({});

const useUserState = () => {
    const queryClient = useQueryClient();
    const userService = useMemo(() => new UserService({}), []);

    const { data, error, isFetching, refetch } = useQuery(
        "user",
        () => {
            return userService.getAuthedUser();
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
            onError(err: ApiError) {
                if (err.status === 401) {
                    return queryClient.setQueryData("user", {
                        user: null,
                        favorites: [],
                    });
                }
                throw err;
            },
        }
    );

    const login = async ({ ...props }: LoginProps) => {
        return userService.login(props.email, props.password).then(async () => {
            await refetch();
            queryClient.invalidateQueries("cart");

            return true;
        });
    };

    const register = async ({ name, email, password }: RegisterProps) => {
        return userService.register(name, email, password).then(() => {
            refetch();
            return true;
        });
    };

    const logout = async () => {
        await userService.logout();

        queryClient.setQueryData("user", { user: null, favorites: [] });
        queryClient.invalidateQueries("cart");
    };

    return {
        user: data || null,
        login,
        logout,
        register,
        refetch,
        error,
        isLoading: isFetching,
    };
};

export default useUserState;
