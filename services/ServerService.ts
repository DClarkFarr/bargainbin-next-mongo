import { AxiosRequestConfig } from "axios";
import { GetServerSidePropsContext } from "next";
import IAxiosInterface, {
    IAxiosInterfaceConstructor,
} from "../types/interfaces/IAxiosService";
import { AxiosHttpClient } from "./apiClient";

class ServerService implements IAxiosInterface {
    client: AxiosHttpClient;

    constructor(config: AxiosRequestConfig<any>) {
        this.client = new AxiosHttpClient(config);

        return this;
    }

    static fromServer<T extends IAxiosInterface>(
        this: IAxiosInterfaceConstructor<T>,
        req: GetServerSidePropsContext["req"]
    ): T {
        return new this({
            headers: {
                Cookie: (req.headers.cookie || "") as string,
            },
        });
    }
}

export default ServerService;
