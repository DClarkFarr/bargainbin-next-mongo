export type SquareCategory = {
    id: string;
    name: string;
    slug: string;
    updatedAt: string;
};

export type SquareItem = {
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
