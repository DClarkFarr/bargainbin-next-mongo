import { Db, Document, FindOptions } from "mongodb";
import { SquareImage } from "types/SquareTypes";
import { getMongoDb } from "../mongodb";
import BaseModel from "./baseModel";

export interface ItemDocument {
    itemId: string;
    variationId: string;
    squareUpdatedAt: Date;
    name: string;
    slug: string;
    description: string;
    descriptionHtml: string;
    categoryId: string;
    price: number;
    sku: string;
    productType: string;
    imageIds: string[];
    createdAt: Date;
    syncedAt: Date;
}

type ItemProjectionPresets = "default";

export type ItemUpdateable = Omit<ItemDocument, "createdAt" | "images">;
export type ItemUpdateableWithImages = ItemUpdateable & {
    images: SquareImage[];
};

export type WithImages = ItemDocument & { images: SquareImage[] };

export default class ItemModel extends BaseModel<
    ItemDocument,
    ItemProjectionPresets,
    ItemUpdateable
> {
    constructor(db: Db) {
        super(db);
        this.collectionName = "items";
        this.collection = this.getCollection();
    }

    static async factory() {
        const db = await getMongoDb();
        return new this(db);
    }

    async findByVariationId(
        variationId: string,
        options: FindOptions<ItemDocument> = {}
    ) {
        return this.findOne(
            {
                variationId,
            },
            options
        );
    }
}
