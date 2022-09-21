import { useState } from "react";
import useClasses from "../../../hooks/useClasses";
import { DropdownCallbackProps } from "../Dropdown";

export type DownloadItemProps = DropdownCallbackProps & {
    children?: JSX.Element | JSX.Element[] | string;
};

const DropdownItem = ({
    children,
    isOpen,
    open,
    close,
    closeOnSelect,
}: DownloadItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);

    const itemClasses = useClasses([
        "dropdown__item",
        [isHovered, "dropdown__item--hover"],
    ]);

    const handleClick = () => {
        if (closeOnSelect) {
            close();
        }
    };

    return (
        <div
            className={itemClasses}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            onClick={handleClick}
        >
            {children}
        </div>
    );
};

export default DropdownItem;
