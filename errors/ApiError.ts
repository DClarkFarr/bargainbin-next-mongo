export interface IApiError<T> extends Error {
    status: number;
    data: T;
}
class ApiError<T extends Record<string, unknown> = {}>
    extends Error
    implements IApiError<T>
{
    status: number;
    data: T;

    constructor(message: string, status = 400, data: T) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export default ApiError;
