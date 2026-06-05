import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <RoleProvider>
            <AppStateProvider>
              <ToastProvider>
                <AppShell>{children}</AppShell>
              </ToastProvider>
            </AppStateProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
