import { Category } from "@/types/Category";
import create from "zustand";
import { DateTime } from "luxon";

type SiteState = {
    categories: Category[];
    setCategories: (cs: Category<string>[]) => void;
};

const useSiteState = create<SiteState>((set, get) => ({
    categories: [],
    setCategories: (cs) =>
        set((draft) => {
            draft.categories = cs.map((c) => ({
                ...c,
                squareUpdatedAt: DateTime.fromISO(c.squareUpdatedAt),
                createdAt: DateTime.fromISO(c.createdAt),
                syncedAt: DateTime.fromISO(c.syncedAt),
            }));

            return draft;
        }),
}));

export default useSiteState;
