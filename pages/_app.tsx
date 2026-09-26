import type { AppProps } from "next/app";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${plusJakarta.variable} font-sans min-h-screen`}>
      <Component {...pageProps} />
    </div>
  );
}
