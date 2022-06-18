export async function exposeUser(userID: string, experiment: string) {
  const res = await fetch("https://api.statsig.com/v1/get_config", {
    // All Statsig APIs use POST
    method: "POST",
    // @ts-ignore
    headers: {
      "statsig-api-key": process.env.STATSIG_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        userID,
      },
      configName: experiment,
    }),
  });

  const resData = await res.json();
  if (res.ok) {
    return resData?.value;
  } else {
    throw new Error(
      `Statsig failed with (${res.status}): ${
        typeof resData === "string" ? resData : JSON.stringify(resData, null, 2)
      }`
    );
  }
}
