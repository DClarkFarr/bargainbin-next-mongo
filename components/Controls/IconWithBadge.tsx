import { faGlobe } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";

type IconBadgeProps = {
    icon?: ReactElement;
    count?: number;
    className?: string;
};
const IconWithBadge = ({
    icon = <FontAwesomeIcon fixedWidth icon={faGlobe} />,
    count = 0,
    className = "text-md lg:text-[26px] text-gray-500 hover:text-gray-700",
}: IconBadgeProps) => {
    return (
        <div
            className={`icon relative icon--badge cursor-pointer ${className}`}
        >
            <div className="badge absolute min-w-[15px] top-[-3px] right-[-3px] lg:top-0 lg:right-0 bg-primary text-white rounded-full aspect-square flex justify-center items-center px-1 py-0.5 text-[12px]">
                {count}
            </div>
            <div className="p-2">{icon}</div>
        </div>
    );
};

export default IconWithBadge;
