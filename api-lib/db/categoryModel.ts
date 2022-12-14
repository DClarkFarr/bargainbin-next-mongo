import { Db, FindOptions } from "mongodb";
import { getMongoDb } from "../mongodb";
import BaseModel from "./baseModel";

export interface CategoryDocument {
    id: string;
    name: string;
    slug: string;
    squareUpdatedAt: Date;
    createdAt: Date;
    syncedAt: Date;
    menuOrder: number;
    showOnMenu: boolean;
}

type CategoryProjectionPresets = "default";

export type CategoryUpdateable = Omit<CategoryDocument, "createdAt">;

export default class CategoryModel extends BaseModel<
    CategoryDocument,
    CategoryProjectionPresets,
    CategoryUpdateable
> {
    constructor(db: Db) {
        super(db);
        this.collectionName = "categories";
        this.collection = this.getCollection();
    }

    static async factory() {
        const db = await getMongoDb();
        return new this(db);
    }

    findByCategoryId(
        categoryId: string,
        options: FindOptions<CategoryDocument> = {}
    ) {
        return this.findOne(
            {
                id: categoryId,
            },
            options
        );
    }

    async getSiteCategories() {
        return (
            await this.collection
                .find(
                    {
                        showOnMenu: true,
                    },
                    {
                        sort: {
                            menuOrder: 1,
                        },
                    }
                )
                .toArray()
        ).map(({ _id, ...c }) => {
            return {
                ...c,
                id: _id.toString(),
                squareUpdatedAt: c.squareUpdatedAt.toISOString(),
                createdAt: c.createdAt.toISOString(),
                syncedAt: c.syncedAt.toISOString(),
            };
        });
    }
}
