import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karthik S — Applied AI Engineer",
  description: "Building production AI systems powered by Computer Vision, LLMs, and intelligent agents.",
  openGraph: {
    type: "website",
    title: "Karthik S — Applied AI Engineer",
    description: "Building production AI systems powered by Computer Vision, LLMs, and intelligent agents.",
    url: "https://k4rthik14.github.io/portfolio-website/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karthik S — Applied AI Engineer",
    description: "Building production AI systems powered by Computer Vision, LLMs, and intelligent agents.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="bg-[#090909] text-zinc-100 font-sans antialiased selection:bg-blue-500/10 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
