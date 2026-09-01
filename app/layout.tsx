import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "County Storm Damage Atlas",
  description: "Storm damage distributions for every county in the contiguous US. Thirty years of NOAA data, mapped by season, with historical analogs for current conditions."
};

export const viewport = {
  colorScheme: "light",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body>
        <Nav />
        <div>{children}</div>
      </body>
    </html>
  );
}
