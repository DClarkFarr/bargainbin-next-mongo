import { LoaderProps } from "../../types/loaders";

const FullLoader = ({ children, loading }: LoaderProps) => {
    return (
        <>
            {loading && (
                <div className="absolute w-full h-full top-0 left-0">
                    <div className="relative h-full w-full flex flex-col justify-center items-center">
                        <h2 className="text-2xl gray-300">Loading...</h2>
                    </div>
                </div>
            )}
            {!loading && children}
        </>
    );
};

export default FullLoader;
