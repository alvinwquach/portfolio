import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ApolloWrapper } from "./components/ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alvin Quach - Full Stack Engineer",
  description:
    "Hey there. I'm Alvin Quach, a Full Stack Engineer specializing in React, Next.js, PostgreSQL and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-linear leading-relaxed antialiased selection:bg-indigo-500 selection:text-indigo-100">
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
