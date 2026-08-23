import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  title: {
    default: "Blues-berry · Computer Vision & Web ML",
    template: "%s · Blues-berry",
  },
  description:
    "聚焦远程生理信号感知、计算机视觉与浏览器端机器学习的个人作品集。",
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Blues-berry Portfolio",
    title: "Blues-berry · Computer Vision & Web ML",
    description:
      "Remote physiology, computer vision, and in-browser machine learning.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blues-berry · Computer Vision & Web ML",
    description:
      "Remote physiology, computer vision, and in-browser machine learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
