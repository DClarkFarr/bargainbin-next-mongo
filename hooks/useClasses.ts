import { useMemo } from "react";

type ClassTuple = [show: boolean, cls: string];

const useClasses = (resolveClasses: (string | ClassTuple)[]) => {
    const classes = useMemo(() => {
        return resolveClasses.reduce((acc, curr) => {
            if (typeof curr === "string") {
                acc.push(curr);
            } else if (Array.isArray(curr) && curr[0]) {
                acc.push(curr[1]);
            }
            return acc;
        }, [] as string[]);
    }, [resolveClasses]);

    return classes.join(" ");
};

export default useClasses;
