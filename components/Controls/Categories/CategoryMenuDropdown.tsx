import {
    faBarsStaggered,
    faChevronRight,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown, { DropdownTitleProps } from "../Dropdown";
import styled from "styled-components";
import Link from "next/link";
import useWindowSize from "../../../hooks/useWindowResize";
import { Category } from "../../../types/Category";

const StyledDropdownTitle = styled.div`
    .dropdown__heading {
        min-width: 250px;
        padding: 0.5rem 1rem;
        color: #0083d3;
        background: #fff;

        &:hover {
            background: #0083d3;
            color: #fff;
        }
    }
`;

const CategoryMenuDropdown = () => {
    const categories: Category[] = [];

    const DropdownTitle = (props: DropdownTitleProps) => (
        <StyledDropdownTitle>
            <Dropdown.Title {...props}>
                <div className="flex gap-x-4">
                    <div>
                        <FontAwesomeIcon icon={faBarsStaggered} />
                    </div>
                    <div>All Categories</div>
                </div>
            </Dropdown.Title>
        </StyledDropdownTitle>
    );

    const size = useWindowSize();

    const isMobile = (size?.width || 0) <= 1023;

    return (
        <div className="category-menu-dropdown">
            <Dropdown
                title="All Categories"
                titleSlot={DropdownTitle}
                relative={isMobile}
            >
                {categories.map((c) => (
                    <Dropdown.Item key={c.id}>
                        <Link href={`/category/${c.slug}`}>
                            <a className="block flex justify-between items-center">
                                <span>{c.name}</span>
                                <span className="text-gray-400">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </span>
                            </a>
                        </Link>
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </div>
    );
};

export default CategoryMenuDropdown;
