import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ViewProviders from "@/providers/view-providers";

const sourceSans3 = Source_Sans_3({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Full Next.js Template',
    template: '%s | Full Next.js Template',
  },
  description: 'Production-ready Next.js 16 template with AI-assisted development workflow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", sourceSans3.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ViewProviders>{children}</ViewProviders>
      </body>
    </html>
  );
}
