import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { MouseEvent, useMemo } from "react";
import { FC } from "../../../types/component";

export interface NavItemProps extends FC {
    icon: IconProp;
    href?: string;
    onClick?: (e: MouseEvent) => void;
    exact?: boolean;
}
const NavItem = ({
    icon,
    children,
    href = "",
    onClick,
    exact = false,
}: NavItemProps) => {
    const router = useRouter();

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        } else if (href) {
            router.push(href);
        }
    };

    const stripPre = useMemo(() => {
        return new RegExp("^/");
    }, []);
    const stripPost = useMemo(() => {
        return new RegExp("/$");
    }, []);

    const active = useMemo(() => {
        if (!href.length) {
            return false;
        }
        const stripPath = (path: string) => "/" + path.replace(stripPre, "");
        const stripHref = (path: string) =>
            stripPath(path).replace(stripPost, "");

        if (exact) {
            return stripPath(router.pathname) === stripHref(href);
        }
        return stripPath(router.pathname).indexOf(stripHref(href)) === 0;
        // eslint-disable-next-line
    }, [router, href, exact]);
    return (
        <a
            onClick={handleClick}
            href={href}
            className={`nav-item ${
                active
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-indigo-500 hover:text-gray-100 text-gray-600"
            } flex w-full border-b border-solid border-slate-400 cursor-pointer items-center px-4 py-2 gap-x-2`}
        >
            <div className="nav-item__icon text-center h-full w-10">
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className="nav-item__content">{children}</div>
        </a>
    );
};

export default NavItem;
