import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import SecurityAlerts from "@/components/SecurityAlerts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Opportune - AI-Powered Hiring Platform",
  description: "Connect with India's top tech talent through AI-powered candidate matching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('opportune-theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <SecurityProvider>
        <ThemeProvider>
          <SidebarProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
              suppressHydrationWarning={true}
            >
              {children}
              <SecurityAlerts />
            </body>
          </SidebarProvider>
        </ThemeProvider>
      </SecurityProvider>
    </html>
  );
}