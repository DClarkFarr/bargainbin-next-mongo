import { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const useRecpatcha = ({ defaultAction = "default" }) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [token, setToken] = useState<string>("");

    // Create an event handler so you can call the verification on button click event or form submit
    const execute = useCallback(
        async (action?: string) => {
            if (!executeRecaptcha) {
                return false;
            }

            const t = await executeRecaptcha(action || defaultAction);

            setToken(t);

            return t;
            // Do whatever you want with the token
        },
        [executeRecaptcha, defaultAction]
    );

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        if (defaultAction && executeRecaptcha) {
            execute(defaultAction);
        }
    }, [executeRecaptcha, execute, defaultAction]);

    return {
        isReady: !!executeRecaptcha,
        token,
        execute,
    };
};

export default useRecpatcha;
