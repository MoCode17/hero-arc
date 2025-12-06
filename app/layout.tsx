import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalorieTracker - Simple Calorie & Macro Tracking",
  description:
    "A modern, mobile-first calorie and macronutrient tracking app. Track your meals, monitor your progress, and achieve your health goals.",
  keywords: [
    "calorie tracker",
    "macro tracker",
    "nutrition",
    "diet",
    "health",
    "fitness",
  ],
  authors: [{ name: "CalorieTracker" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CalorieTracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
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
