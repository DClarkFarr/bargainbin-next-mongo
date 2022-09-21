import { ReactNode } from "react";
import useWindowSize from "../../hooks/useWindowResize";
import styled from "styled-components";
import useClasses from "../../hooks/useClasses";
import Dropdown, { DropdownTitleProps } from "./Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/pro-solid-svg-icons";

const StyledMenu = styled.div`
    @media (max-width: 1023px) {
        .mobile-menu__dropdown > .dropdown__pane {
            width: calc(100vw - 50px);
        }
    }
    .mobile-menu--mobile {
        .mobile-menu {
            &__item {
                padding: 0.65rem 1rem;
                display: block;

                &:hover {
                    background-color: #f5f5f5;
                    text-decoration: none !important;
                }
            }
        }
    }
`;

const MobileMenu = ({
    children,
    mobileOnly,
    only,
}: {
    children: ReactNode;
    mobileOnly?: boolean;
    only?: "mobile" | "desktop";
}) => {
    const size = useWindowSize();
    const isMobile = (size?.width || 0) <= 1023;

    const classes = useClasses([
        "mobile-menu",
        [isMobile, "mobile-menu--mobile"],
    ]);

    const DropdownTitle = (props: DropdownTitleProps) => (
        <Dropdown.Title {...props}>
            <div className="flex gap-x-4 mb-2">
                <div>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <div>Menu</div>
            </div>
        </Dropdown.Title>
    );

    let showMobile = isMobile;
    let showDesktop = !isMobile;

    if (only === "mobile") {
        showDesktop = false;
    } else if (only === "desktop") {
        showMobile = false;
    }

    return (
        <StyledMenu>
            {showMobile && (
                <Dropdown
                    className="mobile-menu__dropdown"
                    titleSlot={DropdownTitle}
                    relative={true}
                >
                    <div className={classes}>{children}</div>
                </Dropdown>
            )}
            {showDesktop && <div className={classes}>{children}</div>}
        </StyledMenu>
    );
};

export default MobileMenu;
