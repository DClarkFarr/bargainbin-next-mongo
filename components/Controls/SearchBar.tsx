import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, KeyboardEvent, useState } from "react";

const SearchBar = ({
    onSearch = () => Promise.resolve(),
}: {
    onSearch?: () => Promise<void>;
}) => {
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.length > 0) {
            onSearchClick();
        }
    };

    const onSearchClick = async () => {
        if (searchTerm.length > 0 && !searching) {
            setSearching(true);
            try {
                await onSearch();
            } catch (err) {
                console.warn("search bar error", err);
            }
            setTimeout(() => {
                setSearching(false);
            }, 2000);
        }
    };

    const onClear = () => {
        setSearchTerm("");
    };

    return (
        <div className="search-bar">
            <div className="input-group flex">
                <div className="grow">
                    <div className="relative">
                        <input
                            className="form-control leading-none w-full rounded-l-full border-gray-300 text-gray-500 focus:text-gray-700 focus:border-gray-700 focus:outline-none pl-6 pr-10"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={onInputChange}
                            onKeyUp={onKeyUp}
                        />

                        {!searching && searchTerm.length > 0 && (
                            <div
                                onClick={onClear}
                                className="absolute center-v right-3"
                            >
                                <FontAwesomeIcon
                                    icon={solid("times")}
                                    className="cursor-pointer text-gray-400 hover:text-gray-500 text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="grow-0">
                    <button
                        className="btn btn-primary rounded-r-full !py-1.5"
                        type="submit"
                        disabled={searching || searchTerm.length === 0}
                        onClick={onSearchClick}
                    >
                        <span className="inline-block leading-none px-2">
                            {searching && (
                                <FontAwesomeIcon
                                    icon={solid("circle-notch")}
                                    spin
                                />
                            )}
                            {!searching && (
                                <FontAwesomeIcon icon={solid("search")} />
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
