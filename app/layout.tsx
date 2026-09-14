import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LifeFlow — AI Goal-to-Action Planner",
  description: "Turn any goal into a clear 5-step action plan in under 60 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
