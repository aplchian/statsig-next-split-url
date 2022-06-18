import { NextRequest, NextResponse } from "next/server";
import { exposeUser } from "../lib/expose-user";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const PUBLIC_FILE = /\.(.*)$/;
  let res = NextResponse.next();
  // Get users UID from the cookie
  let userID = req.cookies["statsig-userID"];
  if (!userID) {
    userID = crypto.randomUUID?.() || "";
  }

  res.cookie("statsig-userID", userID);

  const apiRoute = pathname.includes("/api");
  if (!apiRoute && !PUBLIC_FILE.test(pathname)) {
    const URL_TESTS: Record<string, string> = getURLTests();
    const experiment = URL_TESTS[pathname];

    if (!experiment) return;

    // Fetch experiment from Statsig
    const expPathName =
      (await exposeUser(userID, experiment)
        .then((value) => value?.["target_path"] || null)
        .catch(console.error)) || null;

    if (expPathName && expPathName !== pathname) {
      // Clone the URL and change its pathname to point to a bucket
      const url = req.nextUrl.clone();
      url.pathname = expPathName;
      res = NextResponse.redirect(url);
    }

    return res;
  }
  return res;
}

function getURLTests(): Record<string, string> {
  let splitUrlTests;
  try {
    const SPLIT_URL_TESTS = process?.env?.SPLIT_URL_TESTS || "{}";
    splitUrlTests = JSON.parse(SPLIT_URL_TESTS);
  } catch (e) {
    splitUrlTests = {};
  }
  return splitUrlTests;
}
