import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARIA | Adaptive Recommendation Intelligence Architecture",
  description: "A production-grade, portfolio-worthy AI personalization platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-accent-blue selection:text-white">
        {children}
      </body>
    </html>
  );
}
