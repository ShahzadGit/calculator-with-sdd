import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arithmetic Calculator",
  description: "A simple arithmetic calculator with six operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
