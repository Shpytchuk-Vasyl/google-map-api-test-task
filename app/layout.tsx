import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MarkersProvider } from "./context/Markers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdventureQuest Map",
  description:
    "Explore the AdventureQuest Map, a dynamic and interactive platform that allows you to create, manage, and track quests in real-time. Dive into a world of adventure where you can drag and drop quests, update their status, and collaborate with fellow adventurers. Discover new locations, mark milestones, and share your journey with friends. Embark on an epic questing experience like never before!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-2 bg-gray-100">
          <MarkersProvider>{children}</MarkersProvider>
        </main>
      </body>
    </html>
  );
}
