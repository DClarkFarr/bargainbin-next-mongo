import Head from "next/head";
import { FC } from "../../types/component";

interface MetaHeadProps extends FC {
    title?: string;
    description?: string;
    keywords?: string;
}

const MetaHead = ({
    title: defaultTitle,
    description: defaultDescription,
    keywords: defaultKeywords,
    children,
}: MetaHeadProps) => {
    const translations = {
        title: {
            base: "Sunset Bargain Bin",
        },
        description: {
            base: "Best bargains in Southern Utah",
        },
        keywords: {
            base: "Bargains, Deals, Southern Utah, Open Box, Products, Ecommerce",
        },
    };

    const translate = (str: string, translations: Record<string, string>) => {
        return Object.entries(translations).reduce((s, [k, v]) => {
            return s.replace(new RegExp(`\\[${k}\\]`, "g"), v);
        }, str);
    };

    const title = translate(
        defaultTitle || translations.title.base,
        translations.title
    );
    const description = translate(
        defaultDescription || translations.description.base,
        translations.description
    );
    const keywords = translate(
        defaultKeywords || translations.keywords.base,
        translations.keywords
    );

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="icon" href="/favicon.ico" />
            {children}
        </Head>
    );
};

export default MetaHead;
