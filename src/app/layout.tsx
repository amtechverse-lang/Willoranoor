import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    openGraph: {
      siteName: settings.siteName,
      images: settings.ogImage ? [settings.ogImage] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} min-h-screen antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster position="bottom-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
