import type { Metadata } from "next";
import { Instrument_Serif, Onest } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Missio — Гранты и стажировки для школьников Казахстана",
  description:
    "Персональный AI-агент для школьников: заполни профиль один раз и получай алерты о подходящих грантах, стажировках и программах обмена за месяц до дедлайна.",
  openGraph: {
    title: "Missio",
    description: "Гранты и стажировки, которые ждут тебя",
    siteName: "Missio",
    locale: "ru_KZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${instrumentSerif.variable} ${onest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
