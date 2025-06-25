import { Review } from "@/lib/types";

export function Reviews({data}:{data:Review[]}){
    
    return (
        <div className="flex flex-row gap-[34px] flex-wrap justify-center max-w-[983px] text-[24px] text-[#000000]">
        {
          data.map((review)=>(
            <div key={review.id} className="bg-[#D9D9D9] rounded-[15px] px-[27px] py-[20px] max-w-[468px]">
              <div>Отзыв {review.id}</div>
              <div dangerouslySetInnerHTML={{ __html: review.text }}></div>
            </div>
          ))
        }
      </div>
    );
}