import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs';
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"]});


export const metadata: Metadata = {
  title: "VideoAdda – Watch, Upload & Share Videos | The Ultimate Video Platform",
  description: "VideoAdda is a video-sharing platform like YouTube, where you can watch, upload, and share videos. Explore entertainment, education, vlogs, gaming, and more!",
  keywords: [
    "VideoAdda",
    "video streaming",
    "upload videos",
    "share videos",
    "watch videos",
    "live streaming",
    "video platform",
    "entertainment",
    "vlogging",
    "gaming",
    "education"
  ],
  authors: [{ name: "Shiwang Pandey" }],
  icons: {
    icon: "/logo.svg",  
    apple: "/icon.png", 
    shortcut: "/icon.png",  
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body  className={inter.className}>
          <TRPCProvider>
            <Toaster/>
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
