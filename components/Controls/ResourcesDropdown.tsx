import Link from "next/link";
import Dropdown, { DropdownTitleProps } from "./Dropdown";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/pro-solid-svg-icons";

const StyledDropdown = styled.div`
    @media (min-width: 1024px) {
        .dropdown__pane {
            top: 145% !important;
            min-width: unset !important;
            border-top: solid 2px #0083d3;
        }
        .arrow-up {
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;

            border-bottom: 5px solid #0083d3;

            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -8px;
        }
    }
    @media (max-width: 1023px) {
        .dropdown__item {
            padding: 0 !important;
        }
    }
`;

const ResourcesDropdown = () => {
    const DropdownTitle = (props: DropdownTitleProps) => (
        <Dropdown.Title {...props}>
            <div className="flex gap-x-4 justify-between px-4 py-1">
                <div>Resources</div>

                <div>
                    <FontAwesomeIcon
                        icon={props.isOpen ? faCaretDown : faCaretRight}
                    />
                </div>
            </div>
        </Dropdown.Title>
    );

    return (
        <StyledDropdown>
            <Dropdown titleSlot={DropdownTitle} align="center">
                <div className="arrow-up"></div>
                <Dropdown.Item>
                    <Link href="/faq">
                        <a className="mobile-menu__item hover:underline px-2">
                            FAQs
                        </a>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link href="/about-us">
                        <a className="mobile-menu__item hover:underline px-2">
                            About Us
                        </a>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link href="/contact-us">
                        <a className="mobile-menu__item hover:underline px-2">
                            Contact Us
                        </a>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link href="/privacy-policy">
                        <a className="mobile-menu__item hover:underline px-2">
                            Privacy Policy
                        </a>
                    </Link>
                </Dropdown.Item>
            </Dropdown>
        </StyledDropdown>
    );
};

export default ResourcesDropdown;
