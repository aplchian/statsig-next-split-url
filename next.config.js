module.exports = async () => {
  return {
    reactStrictMode: true,
    trailingSlash: true,
    env: {
      SPLIT_URL_TESTS: JSON.stringify(await getUrlSplitTests()),
    },
  };
};

async function getUrlSplitTests() {
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

    if (fetchRes.ok) {
      return resData?.value;
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
    throw new Error("statsig split test error fetching");
  }
}
