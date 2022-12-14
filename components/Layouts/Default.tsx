import { useEffect, useRef } from "react";
import { FC } from "../../types/component";
import DefaultFooter from "./Default/Footer";
import DefaultHeader from "./Default/Header";
import useModalState from "../../hooks/useModalState";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export interface DefaultLayoutProps extends FC {
    Header?: () => JSX.Element;
    Footer?: () => JSX.Element;
}

const DefaultLayout = ({ children, Header, Footer }: DefaultLayoutProps) => {
    const { registerModalsTarget } = useModalState();

    const modalsDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (modalsDiv.current) {
            registerModalsTarget(modalsDiv.current);
        }
    }, [modalsDiv.current]);

    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT as string;

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            <div className="layout">
                {Header ? <Header /> : <DefaultHeader />}

                <div className="main">{children}</div>

                {Footer ? <Footer /> : <DefaultFooter />}

                <div id="modals" ref={modalsDiv}></div>
            </div>
        </GoogleReCaptchaProvider>
    );
};
export default DefaultLayout;
