import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrawlPay",
  description: "Monetize your site for the AI era — charge bots $0.001 USDC per page",
};

// TODO: Root layout — navigation, fonts, providers

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{
        minHeight: "100%",
        background: "#1a1a2e",
        overflowX: "hidden",
        scrollBehavior: "smooth",
      }}
    >
      <body
        className="antialiased"
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100%",
          background: "#1a1a2e",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </body>
    </html>
  );
}
