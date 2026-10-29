import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import ScrollProgress from "@/components/layout/ScrollProgress";

export const metadata: Metadata = {
  title: "Найди свой грант",
  description:
    "Гранты, обмены и олимпиады для школьников Казахстана: 580+ программ, подбор по профилю и напоминания о дедлайнах.",
  metadataBase: new URL("https://poam.me"),
  openGraph: {
    title: "Платформа",
    description: "Архив образовательных возможностей для школьников Казахстана",
    siteName: "Платформа",
    locale: "ru_KZ",
    type: "website",
    url: "https://poam.me",
    emails: ["hello@poam.me"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-secondary)] text-[var(--foreground)] font-display antialiased">
        <SmoothScrollProvider>
          <ScrollProgress />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
