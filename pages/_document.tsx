import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
