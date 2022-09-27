import { SquareCategory, SquareItem } from "../../types/SquareTypes";
import ItemModel, { ItemDocument, ItemUpdateable } from "../db/itemModel";
import { DateTime } from "luxon";

import squareClient from "@/api-lib/squareClient";
import { ApiError, CatalogObject, ListCatalogResponse } from "square";
import { toSlug } from "methods/url";

export default class SquareService {
    async fetchCatalogObjects() {
        const catalogApi = squareClient.catalogApi;

        let response: ListCatalogResponse = { objects: [] };

        try {
            const { result } = await catalogApi.listCatalog();
            response = result;
        } catch (error) {
            if (error instanceof ApiError) {
                const errors = error.result;
                console.log("error loading catalog", errors);
                // const { statusCode, headers } = error;
            }
        }

        return response.objects || [];
    }

    mapCatalogObjects(objects: Required<ListCatalogResponse>["objects"]) {
        const categories: SquareCategory[] = [];
        const items: SquareItem[] = [];
        const others: CatalogObject[] = [];

        objects?.forEach((item) => {
            if (
                item.type === "CATEGORY" &&
                item?.categoryData?.name &&
                !item.isDeleted
            ) {
                categories.push({
                    id: item.id,
                    slug: toSlug(item.categoryData.name),
                    name: item.categoryData.name,
                    updatedAt: item.updatedAt as string,
                });
            } else if (item.type === "ITEM" && !item.isDeleted) {
                item.itemData?.variations?.forEach((variation) => {
                    const amount = Number(
                        variation.itemVariationData?.priceMoney?.amount || 0
                    );

                    items.push({
                        itemId: item.id,
                        variationId: variation.id,
                        updatedAt: item.updatedAt || "",
                        name: item.itemData?.name || "",
                        slug: toSlug(item.itemData?.name || ""),
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
            } else {
                others.push(item);
            }
        });

        return {
            items,
            categories,
            others,
        };
    }

    async syncCatalog() {
        const objects = await this.fetchCatalogObjects();

        const { categories, items, others } = this.mapCatalogObjects(objects);

        const itemResults = await this.syncItems(items);

        return {
            items: itemResults,
            others,
        };
    }

    async syncItems(items: SquareItem[]) {
        const results: {
            variationId: string;
            name: string;
            action: "create" | "update" | "error";
            message?: string;
        }[] = [];

        const itemModel = await ItemModel.factory();

        const promises = items.map(async (item) => {
            const existingItem = await itemModel.findByVariationId(
                item.variationId
            );

            const toSet: ItemUpdateable = {
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
                images: [],
                syncedAt: DateTime.now().toJSDate(),
            };

            if (existingItem) {
                await itemModel.collection.updateOne(
                    {
                        _id: existingItem._id,
                    },
                    {
                        $set: toSet,
                    }
                );
                results.push({
                    name: item.name,
                    variationId: item.variationId,
                    action: "update",
                });
            } else {
                try {
                    const created = await itemModel.collection.insertOne({
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
