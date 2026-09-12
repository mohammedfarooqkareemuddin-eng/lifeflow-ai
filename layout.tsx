import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeFlow — Turn Goals Into Action",
  description: "A simple personal action-plan generator."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}