import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Noto_Sans, Noto_Sans_Devanagari, Playfair_Display } from "next/font/google";

import { getAuthRoutes, isClerkConfigured } from "@/lib/server/env";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const publicBodyFont = Noto_Sans({
  variable: "--font-public-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const publicHindiFont = Noto_Sans_Devanagari({
  variable: "--font-public-hindi",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jan Sahayak",
  description:
    "Public legal-help and scheme guidance portal with a protected Janman People's Foundation admin workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authRoutes = getAuthRoutes();
  const content = isClerkConfigured() ? (
    <ClerkProvider
      signInUrl={authRoutes.signIn}
      signUpUrl={authRoutes.signUp}
      appearance={{
        variables: {
          colorBackground: "#09101F",
          colorInputBackground: "#101724",
          colorInputText: "#CBD8ED",
          colorPrimary: "#E8A243",
          colorText: "#CBD8ED",
          colorTextSecondary: "#6278A0",
        },
      }}
    >
      {children}
    </ClerkProvider>
  ) : (
    children
  );

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${publicBodyFont.variable} ${publicHindiFont.variable}`}
    >
      <body>{content}</body>
    </html>
  );
}
