import { AxiosRequestConfig } from "axios";
import { AxiosHttpClient } from "../../services/apiClient";

interface IAxiosInterface {
    client: AxiosHttpClient;
}

export interface IAxiosInterfaceConstructor<T extends IAxiosInterface> {
    new (config: AxiosRequestConfig<any>): T;
}

export default IAxiosInterface;
