import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { getSession } from "@/lib/auth/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matchday Lineup",
  description:
    "Manage your squad and get an AI-assisted recommended lineup for every matchday.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <NavBar user={session ? { username: session.username, teamName: session.teamName } : null} />
          <main className="flex-1">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
