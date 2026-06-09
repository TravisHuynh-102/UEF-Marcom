/* eslint-disable */
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { LanguageProvider } from "@/context/language-context";
import { RoleProvider } from "@/context/role-context";
import { AppStateProvider } from "@/context/app-state-context";
import { ToastProvider } from "@/components/ui/toast";
import AppShell from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "TeamOS AI — AI-Powered Team Operating System",
  description:
    "TeamOS AI is an intelligent team operating system where AI acts as your Chief Operating Officer. Manage projects, tasks, team performance, and get AI-driven insights for startups, agencies, and SMEs.",
  keywords: [
    "team management",
    "AI COO",
    "project management",
    "team analytics",
    "startup tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#191919] text-[#FFFFFF] font-body-md text-body-md h-screen overflow-hidden flex selection:bg-[#9D5DFF]/30 selection:text-white antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <RoleProvider>
              <AppStateProvider>
                <ToastProvider>
                  <AppShell>{children}</AppShell>
                </ToastProvider>
              </AppStateProvider>
            </RoleProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
