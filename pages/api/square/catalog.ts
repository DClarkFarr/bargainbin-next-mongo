import nc from "next-connect";
import { ncOpts } from "@/api-lib/nc";
import { NextApiRequest, NextApiResponse } from "next";
import squareClient from "@/api-lib/squareClient";
import { ApiError, CatalogObject, ListCatalogResponse } from "square";
import { toSlug } from "methods/url";
import { SquareCategory, SquareItem } from "types/SquareTypes";
import SquareService from "@/api-lib/services/SquareService";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};
const handler = nc(ncOpts);

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
    const squareService = new SquareService();
    const objects = await squareService.fetchCatalogObjects();

    const { categories, items, others } =
        squareService.mapCatalogObjects(objects);

    res.json({
        categories,
        items,
        others,
    });
});

export default handler;
