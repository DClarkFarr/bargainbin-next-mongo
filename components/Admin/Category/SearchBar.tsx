import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { debounce } from "lodash";

export type SearchPairs = {
    id: string;
    value: string;
    filter: boolean;
};

const SearchBar = ({
    keyLabel,
    pairs,
    onSearch,
    onReset,
}: {
    keyLabel: string;
    pairs: SearchPairs[];
    onSearch: (ids: string[]) => void;
    onReset: () => void;
}) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(false);

    const [filteredPairs, setFilteredPairs] = useState<SearchPairs[]>([]);

    const filterPairs = () => {
        let filtered = [...pairs];
        if (search.length > 0) {
            filtered = filtered.filter((pair) =>
                pair.value.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter) {
            filtered = filtered.filter((pair) => pair.filter);
        }

        setFilteredPairs(filtered);
        onSearch(filtered.map((pair) => pair.id));
    };

    const filterPairsDebounced = debounce(filterPairs, 350);

    const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        filterPairsDebounced();
    };

    const onToggleFilter = () => {
        setFilter(!filter);
        filterPairsDebounced();
    };

    const onClearFilters = () => {
        setSearch("");
        setFilter(false);
        onReset();
    };

    return (
        <div className="flex gap-4 items-center">
            <div>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={search}
                    onChange={onChangeSearch}
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="filter"
                        checked={filter}
                        onChange={onToggleFilter}
                    />

                    <span className="ml-2">Show {keyLabel} only</span>
                </label>
            </div>
            {(search.length > 0 || filter) && (
                <>
                    <div className="ml-auto text-gray-500">
                        Matched {filteredPairs.length} of {pairs.length}{" "}
                    </div>
                    <div>
                        <button
                            className="btn btn-sm bg-red-600 hover:bg-red-800"
                            onClick={onClearFilters}
                        >
                            <FontAwesomeIcon icon={solid("times")} /> Clear
                            Filter
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchBar;
