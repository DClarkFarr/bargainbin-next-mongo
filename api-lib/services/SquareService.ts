import {
    SquareCategory,
    SquareImage,
    SquareItem,
} from "../../types/SquareTypes";
import ItemModel, {
    ItemDocument,
    ItemUpdateable,
    ItemUpdateableWithImages,
} from "../db/itemModel";
import { DateTime } from "luxon";

import squareClient from "@/api-lib/squareClient";
import {
    ApiError,
    CatalogImage,
    CatalogObject,
    ListCatalogResponse,
} from "square";
import { toSlug } from "methods/url";

import { keyBy } from "lodash";
import CategoryModel, { CategoryUpdateable } from "../db/categoryModel";
import { ObjectId } from "mongodb";

export default class SquareService {
    async fetchCatalogObjects() {
        const catalogApi = squareClient.catalogApi;

        let objects: Required<ListCatalogResponse>["objects"] = [];

        try {
            let { result } = await catalogApi.listCatalog(
                undefined,
                "ITEM,CATEGORY,IMAGE"
            );

            objects.push(...(result.objects || []));

            while (result.cursor) {
                result = (
                    await catalogApi.listCatalog(
                        result.cursor,
                        "ITEM,CATEGORY,IMAGE"
                    )
                ).result;
                objects.push(...(result.objects || []));
            }
        } catch (error) {
            if (error instanceof ApiError) {
                const errors = error.result;
                console.warn("error loading catalog", errors);
                // const { statusCode, headers } = error;
            }
        }

        return objects;
    }

    mapCatalogObjects(objects: Required<ListCatalogResponse>["objects"]) {
        const categories: SquareCategory[] = [];
        const items: SquareItem[] = [];
        const images: SquareImage[] = [];
        const others: CatalogObject[] = [];

        objects?.forEach((item) => {
            if (item.type === "CATEGORY") {
                if (!(item?.categoryData?.name && !item.isDeleted)) {
                    return;
                }
                categories.push({
                    id: item.id,
                    slug: toSlug(item.categoryData.name),
                    name: item.categoryData.name,
                    updatedAt: item.updatedAt as string,
                });
            } else if (item.type === "ITEM") {
                if (
                    !(
                        !item.isDeleted &&
                        item?.itemData?.productType === "REGULAR"
                    )
                ) {
                    return;
                }
                item.itemData?.variations?.forEach((variation) => {
                    const amount = Number(
                        variation.itemVariationData?.priceMoney?.amount || 0
                    );

                    const vname = variation.itemVariationData?.name || "";

                    const name = `${item.itemData?.name as string}${
                        vname ? ` - ${vname}` : ""
                    }`;

                    items.push({
                        itemId: item.id,
                        variationId: variation.id,
                        updatedAt: item.updatedAt || "",
                        name,
                        slug: toSlug(name),
                        description: item.itemData?.description || "",
                        descriptionHtml: item.itemData?.descriptionHtml || "",
                        categoryId: item.itemData?.categoryId || "",
                        price: amount,
                        sku:
                            item.itemData?.variations?.[0]?.itemVariationData
                                ?.sku || "",
                        imageIds: item.itemData?.imageIds || [],
                        productType: item.itemData?.productType || "",
                    });
                });
            } else if (item.type === "IMAGE") {
                if (!(item.imageData?.url && !item.isDeleted)) {
                    return;
                }
                images.push({
                    id: item.id,
                    name: item.imageData?.name || "",
                    url: item.imageData?.url || "",
                    updatedAt: item.updatedAt || "",
                });
            } else {
                others.push(item);
            }
        });

        return {
            items,
            categories,
            images,
            others,
        };
    }

    async syncCatalog() {
        const objects = await this.fetchCatalogObjects();

        const { categories, items, others, images } =
            this.mapCatalogObjects(objects);

        const itemResults = await this.syncItems(items, images);
        const categoryResults = await this.syncCategories(categories, images);

        return {
            items: itemResults,
            categories: categoryResults,
            others,
        };
    }

    async syncCategories(categories: SquareCategory[], images: SquareImage[]) {
        const results: {
            name: string;
            action: "create" | "update" | "error";
            hasBeenUpdated?: boolean;
        }[] = [];

        const categoryModel = await CategoryModel.factory();

        const promises = categories.map(async (category) => {
            const existing = await categoryModel.findByCategoryId(category.id);

            const toSet: CategoryUpdateable = {
                id: category.id,
                name: category.name,
                slug: category.slug,
                squareUpdatedAt: DateTime.fromISO(
                    category.updatedAt
                ).toJSDate(),
                syncedAt: DateTime.now().toJSDate(),
            };

            if (existing) {
                const hasBeenUpdated =
                    DateTime.fromJSDate(toSet.squareUpdatedAt) >
                    DateTime.fromJSDate(existing.squareUpdatedAt);

                if (hasBeenUpdated) {
                    await categoryModel.collection.updateOne(
                        {
                            _id: existing._id,
                        },
                        {
                            $set: toSet,
                        }
                    );
                }

                results.push({
                    name: category.name,
                    action: "update",
                    hasBeenUpdated,
                });
            } else {
                await categoryModel.collection.insertOne({
                    ...toSet,
                    createdAt: DateTime.now().toJSDate(),
                });

                results.push({
                    name: category.name,
                    action: "create",
                });
            }
        });

        await Promise.all(promises);

        return results;
    }

    async syncItems(items: SquareItem[], images: SquareImage[]) {
        const keyedImages = keyBy(images, "id");

        const results: {
            variationId: string;
            name: string;
            action: "create" | "update" | "error";
            message?: string;
            hasBeenUpdated?: boolean;
        }[] = [];

        const itemModel = await ItemModel.factory();

        const promises = items.map(async (item) => {
            const existingItem = await itemModel.findByVariationId(
                item.variationId
            );

            let toSet: ItemUpdateable = {
                itemId: item.itemId,
                variationId: item.variationId,
                squareUpdatedAt: DateTime.fromISO(item.updatedAt).toJSDate(),
                name: item.name,
                slug: item.slug,
                description: item.description,
                descriptionHtml: item.descriptionHtml,
                categoryId: item.categoryId,
                price: item.price,
                sku: item.sku,
                productType: item.productType,
                imageIds: item.imageIds,
                syncedAt: DateTime.now().toJSDate(),
            };

            if (existingItem) {
                if (
                    item.imageIds.join(",") !== existingItem.imageIds.join(",")
                ) {
                    toSet.imageIds = item.imageIds;

                    const images = item.imageIds.reduce((acc, id) => {
                        if (keyedImages[id]) {
                            acc.push(keyedImages[id]);
                        }
                        return acc;
                    }, [] as SquareImage[]);

                    toSet = {
                        ...toSet,
                        images,
                    } as ItemUpdateableWithImages;
                }

                const hasBeenUpdated =
                    DateTime.fromJSDate(toSet.squareUpdatedAt) >
                    DateTime.fromJSDate(existingItem.squareUpdatedAt);

                if (hasBeenUpdated) {
                    await itemModel.collection.updateOne(
                        {
                            _id: existingItem._id,
                        },
                        {
                            $set: toSet,
                        }
                    );
                }

                results.push({
                    name: item.name,
                    variationId: item.variationId,
                    action: "update",
                    hasBeenUpdated,
                });
            } else {
                try {
                    toSet.imageIds = item.imageIds;

                    const images = item.imageIds.reduce((acc, id) => {
                        if (keyedImages[id]) {
                            acc.push(keyedImages[id]);
                        }
                        return acc;
                    }, [] as SquareImage[]);

                    toSet = {
                        ...toSet,
                        images,
                    } as ItemUpdateableWithImages;

                    await itemModel.collection.insertOne({
                        ...toSet,
                        createdAt: DateTime.now().toJSDate(),
                    });
                    results.push({
                        name: item.name,
                        variationId: item.variationId,
                        action: "create",
                    });
                } catch (err) {
                    if (err instanceof Error) {
                        results.push({
                            name: item.name,
                            variationId: item.variationId,
                            action: "error",
                            message: err.message,
                        });
                    }
                }
            }
        });

        await Promise.all(promises);

        return results;
    }
}
