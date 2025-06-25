import { Product } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function ProductItem({product, basketItems, setBasketItems}:{product:Product, basketItems:Product[], setBasketItems:Dispatch<SetStateAction<Product[]>>}){
    const [quantity, setQuantity] = useState(1)
    async function addToBasket(product:Product){
        setBasketItems([...basketItems,{ ...product, quantity: quantity }]);
        localStorage.setItem('basket', JSON.stringify(basketItems));
    }

    async function removeFromBasket(id:number){
        setBasketItems(basketItems.filter((item)=>item.id!=id));
        localStorage.setItem('basket', JSON.stringify(basketItems))
    }

    async function editQuantity(id:number) {
        setBasketItems(basketItems.map((item)=>(
            item.id === id
                ? { ...item, quantity: quantity }
                : item
        )))
    }

    useEffect(()=>{
        if(quantity<1){
            removeFromBasket(product.id);
            setQuantity(1);
        } else{
            editQuantity(product.id);
        }
        

    },[quantity])

    return(
        <div key={product.id} className="bg-[#D9D9D9] w-full rounded-[15px] p-[10px] flex flex-col justify-between gap-y-[33px]">
            <div className="flex flex-col gap-[5px] w-full">
                <img className="w-full" alt={product.title} src={product.image_url}/>
                <div className="text-[36px] w-full">{product.title}</div>
                <div className="text-[24px] w-full">{product.description}</div>
            </div>
            <div className="text-[36px] lowercase">
                <div className="text-center">цена: {product.price} ₽</div>
                {basketItems.find((item)=>item.id == product.id) ? <div className="w-full grid grid-cols-4 gap-x-[12px] text-[#F0F0F0]">
                <button onClick={(e)=>{setQuantity(qty=>qty-1)}} className="text-[36px] py-[12px] bg-[#222222] rounded-[15px] size-[68px] flex items-center justify-center">-</button><input value={quantity} onChange={(e)=>{e.preventDefault(); setQuantity(Number(e.target.value))}} className="text-[36px] py-[12px] bg-[#222222] rounded-[15px] col-span-2 !w-full h-[68px] text-center" type="number" /><button onClick={(e)=>{setQuantity(qty=>qty+1)}} className="text-[36px] py-[12px] bg-[#222222] rounded-[15px] size-[68px] flex items-center justify-center">+</button>
                </div> : <button name={"button_"+product.id} onClick={(e)=>{e.preventDefault(); addToBasket(product)}} className="bg-[#222222] text-[#F0F0F0] px-[80px] py-[12px] rounded-[15px] w-full">купить</button>}
                
            </div>
        </div>
)
}