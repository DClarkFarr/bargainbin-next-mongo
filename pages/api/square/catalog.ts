import nc from "next-connect";
import { ncOpts } from "@/api-lib/nc";
import { NextApiRequest, NextApiResponse } from "next";
import squareClient from "@/api-lib/squareClient";
import { ApiError, CatalogObject, ListCatalogResponse } from "square";
import { toSlug } from "methods/url";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};
const handler = nc(ncOpts);

type SquareCategory = {
    id: string;
    name: string;
    slug: string;
    updatedAt: string;
};

type SquareItem = {
    itemId: string;
    variationId: string;
    updatedAt: string;
    name: string;
    slug: string;
    description: string;
    descriptionHtml: string;
    categoryId: string;
    price: number;
    sku: string;
    imageIds: string[];
    productType: string;
};

/*
{
    "type": "ITEM",
    "id": "7UAT2TXLEUXEXDPAHKLBTKE3",
    "updatedAt": "2022-09-21T13:35:22.861Z",
    "version": "1663767322861",
    "isDeleted": false,
    "presentAtAllLocations": true,
    "itemData": {
        "name": "Accent table",
        "description": "Threshold Designed with Studio McGee Canyon Lake Woven accent table\n24”H x 22”W x 22”D",
        "categoryId": "KXDPHHK6ZNVBDTKQ3WFXQSAE",
        "taxIds": [
            "EHG6RGDRJCER4S733NI2YYJA"
        ],
        "variations": [
            {
                "type": "ITEM_VARIATION",
                "id": "5QEJH2GTF6HQXK5YZN3PUKRA",
                "updatedAt": "2022-09-21T13:35:22.861Z",
                "version": "1663767322861",
                "isDeleted": false,
                "presentAtAllLocations": true,
                "itemVariationData": {
                    "itemId": "7UAT2TXLEUXEXDPAHKLBTKE3",
                    "name": "Regular",
                    "sku": "V476551",
                    "ordinal": 1,
                    "pricingType": "FIXED_PRICING",
                    "priceMoney": {
                        "amount": "5000",
                        "currency": "USD"
                    },
                    "locationOverrides": [
                        {
                            "locationId": "LQ57M4M0EC081",
                            "trackInventory": true
                        }
                    ],
                    "trackInventory": true,
                    "sellable": true,
                    "stockable": true
                }
            }
        ],
        "productType": "REGULAR",
        "skipModifierScreen": false,
        "imageIds": [
            "N3EJZXCXXQGEK7JYE52PWA6Y"
        ],
        "descriptionHtml": "<p>Threshold Designed with Studio McGee Canyon Lake Woven accent table</p><p>24”H x 22”W x 22”D</p>",
        "descriptionPlaintext": "Threshold Designed with Studio McGee Canyon Lake Woven accent table\n24”H x 22”W x 22”D"
    }
}
*/
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const catalogApi = squareClient.catalogApi;

    let response: ListCatalogResponse = { objects: [] };

    try {
        const { result, ...httpResponse } = await catalogApi.listCatalog();
        response = result;
    } catch (error) {
        if (error instanceof ApiError) {
            const errors = error.result;
            console.log("error loading catalog", errors);
            // const { statusCode, headers } = error;
        }
    }

    const categories: SquareCategory[] = [];
    const items: SquareItem[] = [];
    const others: CatalogObject[] = [];

    response.objects?.forEach((item) => {
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
                const amount = (variation.itemVariationData?.priceMoney
                    ?.amount || 0) as number;

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

    res.json({
        categories,
        items,
        others,
    });
});

export default handler;
