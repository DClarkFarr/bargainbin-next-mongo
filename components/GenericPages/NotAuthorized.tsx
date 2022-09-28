import { FC } from "../../types/component";

const NotAuthorized = ({ children }: FC) => {
    return (
        <div className="not-found w-full h-full flex flex-col min-h-[500px] items-center justify-center">
            <h2 className="text-2xl text-gray-600">Not Authorized</h2>
            <p className="text-xl mb-10">
                Please login with correct permissions.
            </p>
            {children}
        </div>
    );
};

export default NotAuthorized;
