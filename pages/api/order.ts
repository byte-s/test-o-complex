// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let response = await fetch('http://o-complex.com:1337/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
});
  if(response.ok){
      const resBody = await response.json();
      res.status(200).json(resBody);
  } else {
        const resBody = await response.json();
      res.status(500).json(resBody);
  }
  

}
