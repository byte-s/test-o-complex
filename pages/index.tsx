import Image from "next/image";
import { Inter } from "next/font/google";
import { Review, Product, ProductsResponse } from "@/lib/types";
import { Reviews } from "@/components/Reviews"
import { Products } from "@/components/Products"



const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

 
export async function getServerSideProps() {
  let reviews:Review[] = [];
  let products:ProductsResponse|undefined;

  const reviewRes = await fetch(`http://localhost:3000/api/reviews`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if(reviewRes.ok){
    reviews = await reviewRes.json();
  }

  const productRes = await fetch(`http://localhost:3000/api/products?page=1&page_size=20`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if(productRes.ok){
    products = await productRes.json();
  }

  return { props: { reviews, products } }
}

export default function Home({ reviews, products }:{reviews:Review[], products:ProductsResponse}) {

  return (
    <main
      className={`${inter.className} max-w-[1442px] mx-[auto] p-[14px] flex flex-col gap-y-[105px] items-center`}
    >
      <div className="w-full lowercase text-[40px] md:text-[92px] text-center bg-[#777777] rounded-[15px] text-[#F0F0F0]">
        Тестовое задание
      </div>
      <Reviews data={reviews}/>
      <Products data={products}/>
      {}
    </main>
  );
}
