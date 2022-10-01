import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useUserState from "../../../hooks/useUserState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { MouseEvent } from "react";
import SearchBar from "../../Controls/SearchBar";
import styled from "styled-components";
import IconWithBadge from "../../Controls/IconWithBadge";
import { faHeart, faCartShopping } from "@fortawesome/pro-light-svg-icons";

import dynamic from "next/dynamic";
import MobileMenu from "../../Controls/MobileMenu";
import ResourcesDropdown from "../../Controls/ResourcesDropdown";
import { toFormattedPrice } from "../../../methods/price";

const CategoryMenuDropdown = dynamic(
    () => import("../../Controls/Categories/CategoryMenuDropdown"),
    {
        ssr: false,
    }
);

const StyledHeader = styled.div`
    .header {
        &__logo {
            position: relative;
            z-index: 15;

            img {
                max-height: 120px !important;

                @media (max-width: 767px) {
                    max-height: 100px !important;
                }
            }
        }

        &__top {
            a {
                position: relative;
                z-index: 25;
            }
        }
    }
`;

const DefaultHeader = () => {
    const router = useRouter();
    const { user, logout } = useUserState();

    const onLogout = (e: MouseEvent) => {
        e.preventDefault();

        logout();
        router.push("/");
    };

    const { cartTotal, cartItems } = { cartTotal: 0, cartItems: 0 };

    const mobileMenuContent = (
        <div className="lg:flex lg:justify-between gap-x-4">
            <CategoryMenuDropdown />

            <div className="main-menu lg:flex gap-x-2 lg:gap-x-4 items-center">
                <div>
                    <Link href="/category/clearance">
                        <a className="mobile-menu__item hover:underline px-2">
                            Clearance
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href="/category/featured">
                        <a className="mobile-menu__item hover:underline px-2">
                            Featured
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href="/category/trending">
                        <a className="mobile-menu__item hover:underline px-2">
                            Trending
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href="/category/new-arrivals">
                        <a className="mobile-menu__item hover:underline px-2">
                            New Arrivals
                        </a>
                    </Link>
                </div>
                <div>
                    <ResourcesDropdown />
                </div>
            </div>
        </div>
    );

    const badgesAndCart = (
        <>
            <div>
                <IconWithBadge
                    count={3}
                    icon={<FontAwesomeIcon icon={solid("bell")} />}
                />
            </div>
            <div>
                <IconWithBadge
                    count={13}
                    icon={<FontAwesomeIcon icon={solid("heart")} />}
                />
            </div>
            <div>
                <Link href="/cart">
                    <a>
                        <IconWithBadge
                            count={cartItems}
                            icon={
                                <FontAwesomeIcon
                                    icon={solid("cart-shopping")}
                                />
                            }
                        />
                    </a>
                </Link>
            </div>
            <Link href="/cart">
                <a>
                    <div>
                        <b>My Cart</b>
                    </div>
                    <div className="text-sm">{toFormattedPrice(cartTotal)}</div>
                </a>
            </Link>
        </>
    );
    return (
        <StyledHeader>
            <div className="header bg-white mb-4">
                <div className="header__top text-white bg-zinc-800 text-sm">
                    <div className="container mx-auto">
                        <div className="py-3 flex items-center gap-x-8">
                            <div className="w-32 hidden lg:block"></div>
                            <div className="hidden lg:block">
                                <a
                                    href="mailto:support@thecodeframe.com"
                                    className="hover:underline"
                                >
                                    <FontAwesomeIcon
                                        icon={solid("envelope")}
                                        className="mr-2"
                                    />
                                    <span>support@thecodeframe.com</span>
                                </a>
                            </div>
                            <div className="hidden lg:block">
                                <a
                                    href="tel:4358176657"
                                    className="hover:underline"
                                >
                                    <FontAwesomeIcon
                                        icon={solid("phone")}
                                        className="mr-2"
                                    />
                                    (435) 817-6657
                                </a>
                            </div>

                            <div className="ml-auto flex gap-x-8 items-center">
                                {user ? (
                                    <>
                                        <div>
                                            <Link
                                                href="/account"
                                                passHref={true}
                                            >
                                                <a>
                                                    <FontAwesomeIcon
                                                        icon={solid("lock")}
                                                        className="mr-2"
                                                    />
                                                    My Account
                                                </a>
                                            </Link>
                                        </div>
                                        <div>
                                            <a href="#" onClick={onLogout}>
                                                <FontAwesomeIcon
                                                    className="mr-2"
                                                    icon={solid(
                                                        "right-from-bracket"
                                                    )}
                                                />
                                                Logout
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex gap-x-4">
                                        <div>
                                            <FontAwesomeIcon
                                                icon={solid("user")}
                                            />
                                        </div>
                                        <div>
                                            <Link href="/login" passHref={true}>
                                                <a className="hover:underline">
                                                    Login
                                                </a>
                                            </Link>
                                            <span> or </span>
                                            <Link
                                                href="/register"
                                                passHref={true}
                                            >
                                                <a className="hover:underline">
                                                    Register
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header__middle">
                    <div className="container mx-auto">
                        <div className="lg:flex gap-x-4 items-center w-full pb-1">
                            <div>
                                <div className="-mt-8">
                                    <Link href="/" passHref={true}>
                                        <a className="header__logo inline-block">
                                            <Image
                                                src="/main-logo.png"
                                                alt="Main Logo"
                                                width={290}
                                                height={128}
                                            />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:flex gap-x-4 items-center w-full">
                                <div className="grow mr-auto mb-4 lg:mb-0">
                                    <SearchBar />
                                </div>
                                <div className="grow-0">
                                    <div className="flex items-start justify-between">
                                        <div className="w-20 lg:w-auto">
                                            <MobileMenu only="mobile">
                                                {mobileMenuContent}
                                            </MobileMenu>
                                        </div>
                                        <div className="badges flex items-center gap-x-4 justify-end">
                                            {badgesAndCart}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header__bottom">
                    <div className="container mx-auto">
                        <MobileMenu only="desktop">
                            {mobileMenuContent}
                        </MobileMenu>
                    </div>
                </div>
            </div>
        </StyledHeader>
    );
};

export default DefaultHeader;
