import create, { StateCreator, StoreApi } from "zustand";
import createContext from "zustand/context";
import produce, { Draft } from "immer";
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

type UserStoreState = {
    user: User | null;
    login: (props: LoginProps) => Promise<void>;
    logout: () => Promise<void>;
    register: (props: RegisterProps) => Promise<void>;
};

const { Provider: UserStateProvider, useStore: useUserState } =
    createContext<StoreApi<UserStoreState>>();

const creatUserStateStore = () =>
    create<UserStoreState>((set, get) => {
        const setter = (fn: (state: UserStoreState) => void) =>
            set(produce(fn));

        const login = async ({ email, password }: LoginProps) => {
            console.log("got login", email, password);
        };

        const register = async ({ email, password, name }: RegisterProps) => {
            console.log("got register", email, password, name);
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
