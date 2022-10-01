import { FC } from "@/types/component";
import { Item } from "@/types/Item";
import Image from "next/image";

const ProductListItem = ({
    item,
    children,
}: {
    item: Item;
} & FC) => {
    const img = item.images?.[0]?.url;

    return (
        <div className="product-list-item flex gap-x-4 items-center px-2 py-1 border border-slate-500 rounded mb-2">
            {!!img && (
                <div className="shrink">
                    <Image height={40} width={40} src={img} alt={item.name} />
                </div>
            )}
            {!img && (
                <div className="shrink">
                    <div className="w-10 h-10 bg-gray-300"></div>
                </div>
            )}
            <div className="shrink">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-500">/{item.slug}</div>
            </div>
            <div className="grow">{children}</div>
        </div>
    );
};

export default ProductListItem;
