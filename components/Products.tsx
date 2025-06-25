'use client'

import { Product, ProductsResponse } from "@/lib/types";
import Image from "next/image";
import { format, InputMask, unformat, useMask } from "@react-input/mask";
import { useEffect, useState } from "react";
import { ProductItem } from "./ProductItem";

export function Products({data}:{data:ProductsResponse}){
    const [currentProducts, setProducts] = useState<Product[]>(data.items);
    const [page, setPage] = useState(1);

    const [isFull,setIsFull] = useState(false);

    const [perPage, setPerPage] = useState('20');

    const [basketItems, setBasketItems] = useState<Product[]>([]);
    const [phone, setPhone] = useState('');
    const [phoneValid, setPhoneValid] = useState(true);
    const [isModalShow, setModalShow] = useState(false);

    const inputRef = useMask({
      mask: '+7 (___) ___-__-__',
      replacement: { _: /\d/ },
      showMask: true
    });

    const options = {
      mask: '+7 (___) ___-__-__',
      replacement: { _: /\d/ },
    };

    async function getMore(currentPage:number, staticProducts:Product[]) {
      const res = await fetch(URL+`/api/products?page=${page}&page_size=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(res.ok){
        let newProducts:ProductsResponse = await res.json();
        setProducts(staticProducts.concat(newProducts.items));
        if(newProducts.total == currentProducts.length){
          setIsFull(true);
        }
      }
    }

    async function changePerPage() {
      const res = await fetch(URL+`/api/products?page=1&page_size=${perPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(res.ok){
        let newProducts:ProductsResponse = await res.json();
        setProducts(newProducts.items);
        setPage(1);
      }
    }

    async function sendForm() {
      if(unformat(phone, options).length!=10){
        setPhoneValid(false);
      } else{

      const cart = basketItems.map((item)=>({
        id: item.id,
        quantity: item.quantity
      }));
      
      let response = await fetch(URL+'/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: "7"+unformat(phone, options),
          cart: cart
        })
      });

      setPhoneValid(true);
      setModalShow(true);
      setBasketItems([]);
      localStorage.setItem('basket', JSON.stringify([]));
      localStorage.setItem('phone', phone);
      }
    }

    useEffect(()=>{
      if (typeof window !== 'undefined') {
        const localBasket = localStorage.getItem("basket");
        const localPhone = localStorage.getItem("phone");
        if(localBasket){
          setBasketItems(JSON.parse(localBasket));
        }
        if(localPhone){
          setPhone(localPhone);
        }
      }
    },[])

    useEffect(()=>{
      if(page!=1){
        if(Number(perPage)!=data.total){
          getMore(page, currentProducts);
        }else{
          setIsFull(true)
        }
      } else{
        setProducts(data.items);
      }
    },[page] )

    useEffect(()=>{
      if(data.amount != Number(perPage)){
        changePerPage();
        setIsFull(false);
      } else {
        setProducts(data.items);
        setIsFull(false);
      }
      
    },[perPage])

    

    return (
      <div className="md:max-w-[983px] flex flex-col gap-y-[36px] text-[#000000] w-full items-center">
        <div className="bg-[#D9D9D9] rounded-[15px] p-[10px] md:max-w-[708px] flex flex-col w-full gap-y-[12px]">
          <div className="text-[36px] w-full text-center md:text-left">Добавленные товары</div>
          {
            basketItems.length>0 ? <div className="flex flex-col gap-x-[10px] !text-[24px] w-full gap-y-[20px]">
                            {basketItems.map((item)=>(
                              <div className="inline-flex gap-x-[14px] md:gap-x-[80px]">
                                <div>{item.title}</div>
                                <div className="inline-flex gap-x-[20px]">
                                  <div>
                                    x{item.quantity}
                                  </div>
                                  <div>
                                    {item.price}₽
                                  </div>
                                </div>
                              </div>
                            ))}
                              <div className="grid grid-cols-1 md:grid-cols-5 justify-between text-[#F0F0F0] w-full! gap-y-[20px] gap-x-[16px]">
                                <input className="md:col-span-3 text-[36px] py-[12px] bg-[#222222] rounded-[15px] !w-full h-[68px] text-center" ref={inputRef} value={phone} onChange={(e)=>{e.preventDefault(); setPhone(e.target.value)}} />
                                <button onClick={(e)=>{e.preventDefault(); sendForm()}} className="md:col-span-2 text-[36px] py-[12px] bg-[#222222] rounded-[15px] h-[68px] flex items-center justify-center lowercase">Заказать</button>
                              </div>
                              {!phoneValid && <span>Введите валидный номер</span>}
                          </div>
                        : <div className="flex flex-col gap-x-[10px]">
                            Товаров в корзине нет
                          </div>
          }
          
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-[35px]">
          {
            currentProducts.map((product)=>(
              <ProductItem product={product} basketItems={basketItems} setBasketItems={setBasketItems}/>
            ))
          }
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full gap-y-[20px]">
          {!isFull ? <button onClick={(e)=>{e.preventDefault(); setPage(currPage => currPage+1)}} className="px-[80px] py-[12px] bg-[#F0F0F0] rounded-[15px] text-[#222222] text-[36px]  lowercase">Показать еще</button> : <button onClick={(e)=>scrollTo({top: 0, left: 0, behavior: 'smooth',})} className="px-[80px] bg-[#F0F0F0] rounded-[15px] text-[#222222] text-[36px] py-[12px] lowercase">Наверх</button>}
          <div className="flex flex-row gap-x-2 items-center">
            <div className="text-[#F0F0F0] text-[36px]">по:</div>
            <select onChange={(e)=>{e.preventDefault(); setPerPage(e.target.value);}} className="bg-[#F0F0F0] rounded-[15px] text-[#222222] text-[36px] py-[12px]">
                <option selected value='20'>20</option>
                <option value='60'>60</option>
                <option value='100'>100</option>
                <option value={data.total.toString()}>все</option>
            </select>
          </div>
        </div>
        {isModalShow && <dialog className="w-[510px] left-[480px] p-[10px] align-middle rounded-[15px] flex flex-col gap-y-[20px]" open>
          <div className="text-[44px]">Успешно</div>
          <button className="bg-[#222222] text-[36px] text-[#F0F0F0] px-[80px] py-[12px] rounded-[15px]" onClick={(e)=>{e.preventDefault(); setModalShow(false);}}>OK</button>
          </dialog>}
      </div>
     
    );
}