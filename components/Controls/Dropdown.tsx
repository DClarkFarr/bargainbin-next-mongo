import { useMemo, useState } from "react";
import AnimateHeight from "react-animate-height";
import styled from "styled-components";
import useClasses from "../../hooks/useClasses";
import DropdownItem from "./Dropdown/DropdownItem";

export type DropdownCallbackProps = {
    open: () => void;
    close: () => void;
    isOpen: boolean;
    closeOnSelect: boolean;
};

export type DropdownTitleProps = DropdownCallbackProps & {
    children?: JSX.Element | string;
    isHovered: boolean;
};

type DropdownProps = {
    onSelect?: (value: string) => void;
    closeOnSelect?: boolean;
    align?: "left" | "right" | "center";
    titleSlot?: (props: DropdownTitleProps) => JSX.Element;
    title?: string;
    children: JSX.Element | JSX.Element[];
    animationDuration?: number;
    relative?: boolean;
    className?: string;
};

const DropdownTitle = ({
    isHovered,
    isOpen,
    open,
    close,
    children,
}: DropdownTitleProps) => {
    return (
        <div
            className={`dropdown__heading ${
                isHovered ? "dropdown__heading--hover" : ""
            }`}
            onClick={isOpen ? close : open}
        >
            {children}
        </div>
    );
};

type DropdownItemWrapperProps = {
    children: JSX.Element;
};

const DropdownItemWrapper = ({ children }: DropdownItemWrapperProps) => {
    return children;
};

(DropdownItemWrapper as any).componentName = "DropdownItemWrapper";

const StyledDropdown = styled.div`
    .dropdown {
        position: relative;
    }

    .dropdown__item {
        padding: 0.5rem 1rem;
        cursor: pointer;
        white-space: nowrap;
        &:hover {
            background-color: #f5f5f5;
        }
    }

    .dropdown__pane {
        min-width: 250px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 100%;
        background: #fff;
        z-index: 100;
    }

    .dropdown--left .dropdown__pane {
        left: 0;
    }

    .dropdown--right .dropdown__pane {
        right: 0;
    }

    .dropdown--center .dropdown__pane {
        left: 50%;
        transform: translateX(-50%);
    }

    .dropdown__heading {
        cursor: pointer;
    }

    .dropdown--relative {
        .dropdown {
            &__pane {
                position: relative;
            }
        }
        position: relative;
    }
`;

const Dropdown = ({
    onSelect,
    relative = false,
    closeOnSelect = true,
    align = "left",
    titleSlot: TitleSlot,
    title = "",
    children,
    animationDuration = 200,
    className,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const hoverIn = () => {
        setIsHovered(true);
    };
    const hoverOut = () => {
        setIsHovered(false);
    };

    const open = () => {
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };

    const height = useMemo(() => (isOpen ? "auto" : 0), [isOpen]);

    const props = {
        open,
        close,
        isOpen,
        closeOnSelect,
    };

    const dropdownClasses = useClasses([
        `dropdown`,
        className || "",
        [relative, "dropdown--relative"],
        [isHovered, "dropdown--hover"],
        [isOpen, "dropdown--open"],
        [!!align, `dropdown--${align}`],
    ]);

    return (
        <StyledDropdown>
            <div className={dropdownClasses}>
                <div
                    className={`dropdown__title`}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                >
                    {TitleSlot && (
                        <TitleSlot isHovered={isHovered} {...props} />
                    )}
                    {!TitleSlot && (
                        <DropdownTitle isHovered={isHovered} {...props}>
                            {title}
                        </DropdownTitle>
                    )}
                </div>
                <div className="dropdown__pane">
                    <AnimateHeight
                        duration={animationDuration}
                        height={height} // see props documentation below
                    >
                        {(children as any).length > 0 &&
                            (children as JSX.Element[]).map((child, i) => {
                                if (
                                    child.type.componentName ===
                                    "DropdownItemWrapper"
                                ) {
                                    return (
                                        <DropdownItem {...props} key={i}>
                                            {child}
                                        </DropdownItem>
                                    );
                                }
                                return child;
                            })}
                        {!(children as any).length && children}
                    </AnimateHeight>
                </div>
            </div>
        </StyledDropdown>
    );
};

Dropdown.Item = DropdownItemWrapper;
Dropdown.Title = DropdownTitle;

export default Dropdown;
