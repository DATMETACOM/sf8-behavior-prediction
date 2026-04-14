import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SF8 - Customer Behavior Prediction",
  description: "AI-powered customer behavior analysis for Shinhan Finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
