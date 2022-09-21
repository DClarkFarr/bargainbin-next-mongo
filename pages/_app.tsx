import "../styles/globals.scss";
import type { AppProps } from "next/app";

function SiteWrapper({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default SiteWrapper;
