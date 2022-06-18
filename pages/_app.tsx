import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StatsigProvider } from "statsig-react";
import Cookies from "js-cookie";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || ""}
      user={{
        userID: Cookies.get("statsig-userID") || undefined,
      }}
    >
      <Component {...pageProps} />
    </StatsigProvider>
  );
}

export default MyApp;
