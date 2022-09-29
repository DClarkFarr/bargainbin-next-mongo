import { DateTime } from "luxon";

export type Category<D = DateTime> = {
    id: string;
    name: string;
    slug: string;
    squareUpdatedAt: D;
    createdAt: D;
    syncedAt: D;
    menuOrder: number;
    showOnMenu: boolean;
};
