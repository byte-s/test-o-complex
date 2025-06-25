// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let response = await fetch('http://o-complex.com:1337/reviews', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
});
  if(response.ok){
      const resBody = await response.json();
      res.status(200).json(resBody);
  } else {
      res.status(500).json({ message: "John Doe" });
  }
  

}
