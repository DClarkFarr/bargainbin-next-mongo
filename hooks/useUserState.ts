import create, { StateCreator, StoreApi } from "zustand";
import createContext from "zustand/context";
import produce, { Draft } from "immer";
import { User } from "../types/User";
import UserService from "services/userService";

export type LoginProps = {
    email: string;
    password: string;
};
export type RegisterProps = {
    email: string;
    password: string;
    name: string;
};

type UserStoreState = {
    user: User | null;
    login: (props: LoginProps) => Promise<void>;
    logout: () => Promise<void>;
    register: (props: RegisterProps) => Promise<void>;
};

const { Provider: UserStateProvider, useStore: useUserState } =
    createContext<StoreApi<UserStoreState>>();

const userService = new UserService({});

const creatUserStateStore = () =>
    create<UserStoreState>((set, get) => {
        const setter = (fn: (state: UserStoreState) => void) =>
            set(produce(fn));

        const login = async ({ email, password }: LoginProps) => {
            const user = await userService.login(email, password);
            // setter((state) => {
            //     state.user = user;
            // });
            console.log("query got user", user);
        };

        const register = async ({ email, password, name }: RegisterProps) => {
            const user = await userService.register(name, email, password);

            console.log("got registered user", user);
        };

        const logout = async () => {
            console.log("got logout");
        };

        return {
            user: null,
            login,
            logout,
            register,
        };
    });

export { UserStateProvider, creatUserStateStore };

export default useUserState;
