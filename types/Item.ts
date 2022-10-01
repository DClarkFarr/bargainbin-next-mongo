import { DateTime } from "luxon";
import { SquareImage } from "./SquareTypes";

export type Item<D = DateTime> = {
    id: string;
    itemId: string;
    variationId: string;
    name: string;
    slug: string;
    description: string;
    descriptionHtml: string;
    categoryId: string;
    price: number;
    sku: string;
    productType: string;
    imageIds: string[];
    createdAt: D;
    syncedAt: D;
    squareUpdatedAt: D;
    isClearance: boolean;
    isFeatured: boolean;
    images: SquareImage[];
};
