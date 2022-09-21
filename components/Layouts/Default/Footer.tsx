import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
    faYoutube,
    faTwitter,
    faInstagramSquare,
} from "@fortawesome/free-brands-svg-icons";

import Link from "next/link";
import styled from "styled-components";
import NewsletterSignupBar from "../../Controls/NewsletterSignupBar";

const StyledFooter = styled.div`
    background: #232323;
    color: #fff;

    a {
        opacity: 0.8;

        &:hover {
            opacity: 1;
            text-decoration: underline;
        }
    }

    .list {
        display: flex;
        flex-direction: column;
        row-gap: 6px;
    }
`;

type FooterLinkRow = {
    href: string;
    text: string;
};

const policyLinks: FooterLinkRow[] = [
    {
        href: "/terms",
        text: "Terms and Conditions",
    },
    {
        href: "/seller-policy",
        text: "Policy for Sellers",
    },
    {
        href: "/buyer-policy",
        text: "Policy for Buyers",
    },
    {
        href: "/ship-and-refund",
        text: "Ship & Refund",
    },
    {
        href: "/wholesale-policy",
        text: "Wholesale Policy",
    },
];

const quickLinks: FooterLinkRow[] = [
    {
        href: "/login",
        text: "Login",
    },
    {
        href: "/register",
        text: "Sign Up",
    },
    {
        href: "/faq",
        text: "FAQs",
    },
];

const accountLinks: FooterLinkRow[] = [
    {
        href: "/account",
        text: "My Account",
    },
    {
        href: "/cart",
        text: "My Cart",
    },
    {
        href: "/account/orders",
        text: "My Orders",
    },
];

const FooterLink = ({ text, href }: FooterLinkRow) => {
    return (
        <Link href={href}>
            <a>{text}</a>
        </Link>
    );
};

const DefaultFooter = () => {
    return (
        <StyledFooter className="py-10">
            <div className="container">
                <div className="footer footer--default lg:flex gap-x-4 lg:gap-x-12">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4">
                            Contact Us
                        </h4>

                        <div className="list">
                            <div className="flex gap-x-4 items-center">
                                <div className="w-4">
                                    <FontAwesomeIcon icon={solid("phone")} />
                                </div>
                                <div>(+800) 123 456 7890</div>
                            </div>
                            <div className="flex gap-x-4 items-center">
                                <div className="w-4">
                                    <FontAwesomeIcon icon={solid("envelope")} />
                                </div>
                                <div>manager@infonlet.com</div>
                            </div>
                            <div className="flex gap-x-4 items-center">
                                <div className="w-4">
                                    <FontAwesomeIcon
                                        icon={solid("map-marker")}
                                    />
                                </div>
                                <div>Location store</div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4">
                            Policies &amp; Info
                        </h4>
                        <div className="list">
                            {policyLinks.map((l, i) => (
                                <FooterLink {...l} key={i} />
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h4>
                        <div className="list">
                            {quickLinks.map((l, i) => (
                                <FooterLink {...l} key={i} />
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4">
                            My Account
                        </h4>
                        <div className="list">
                            {accountLinks.map((l, i) => (
                                <FooterLink {...l} key={i} />
                            ))}
                        </div>
                    </div>
                    <div className="mb-6 max-w-[270px]">
                        <h4 className="text-lg font-semibold mb-4">
                            Subscribe Now
                        </h4>
                        <p className="mb-2 opacity-[0.65]">
                            Contrary to popular belief of lorem Ipsm Latin amet
                            ltin from.
                        </p>
                        <div className="mb-2">
                            <NewsletterSignupBar />
                        </div>

                        <div className="icons flex gap-x-4">
                            <div>
                                <Link href="https://twitter.com">
                                    <a target="_blank">
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                </Link>
                            </div>
                            <div>
                                <Link href="https://instagram.com">
                                    <a target="_blank">
                                        <FontAwesomeIcon
                                            icon={faInstagramSquare}
                                        />
                                    </a>
                                </Link>
                            </div>
                            <div>
                                <Link href="https://youtube.com">
                                    <a target="_blank">
                                        <FontAwesomeIcon icon={faYoutube} />
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledFooter>
    );
};

export default DefaultFooter;
