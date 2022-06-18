// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fetchRes = await fetch("https://api.statsig.com/v1/get_config", {
      method: "POST",
      // @ts-ignore
      headers: {
        "statsig-api-key": process.env.STATSIG_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        configName: "split_url_tests",
      }),
    });

    const resData = await fetchRes.json();

    console.log("resData", resData);
    if (fetchRes.ok) {
      // cache response
      res.setHeader("Cache-Control", "max-age=120, s-maxage=31536000");
      res.status(200).json(resData?.value);
    } else {
      throw new Error(
        `Statsig failed with (${res.status}): ${
          typeof resData === "string"
            ? resData
            : JSON.stringify(resData, null, 2)
        }`
      );
    }
  } catch (e) {
    res.status(500);
  }
}
