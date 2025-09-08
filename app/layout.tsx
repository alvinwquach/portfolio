import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "./ApolloWrapper";
import Navbar from "./components/common/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alvin Quach - Full Stack Engineer | Portfolio",
  description:
    "Alvin Quach is a Full Stack Engineer specializing in TypeScript, Next.js, React, Python, GraphQL, and more.",

  authors: [
    {
      name: "Alvin Quach",
      url: "https://www.alvinquach.com",
    },
  ],
  keywords: [
    "Alvin Quach",
    "Full Stack Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "GraphQL",
    "Portfolio",
    "Web Development",
    "Frontend",
    "Backend",
  ],
  creator: "Alvin Quach",
  publisher: "Alvin Quach",
  openGraph: {
    title: "Alvin Quach - Full Stack Engineer | Portfolio",
    description:
      "Explore the portfolio of Alvin Quach, a Full Stack Engineer experienced with TypeScript, Next.js, React, Python, GraphQL, and full-stack web development. Check out projects like SculptQL, Play Plan Craft, and Hone Your Craft.",
    url: "https://www.alvinwquach.me",
    siteName: "Alvin Quach Portfolio",
    type: "website",
  },
  metadataBase: new URL("https://www.alvinwquach.me"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f172a]`}
      >
        <ApolloWrapper>
          <Navbar />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
