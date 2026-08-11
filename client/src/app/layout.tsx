import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import SecurityAlerts from "@/components/SecurityAlerts";
import GoogleProvider from "@/components/GoogleOAuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Opportune — AI-Powered Hiring Platform",
  description:
    "Connect with India's top tech talent through AI-powered candidate matching",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1210",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('opportune-theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                  var meta = document.querySelector('meta[name="theme-color"]');
                  if (meta) {
                    meta.setAttribute('content', isDark ? '#0a1210' : '#f8fafc');
                  } else {
                    var created = document.createElement('meta');
                    created.setAttribute('name', 'theme-color');
                    created.setAttribute('content', isDark ? '#0a1210' : '#f8fafc');
                    document.head.appendChild(created);
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
      </head>
      <GoogleProvider>
        <SecurityProvider>
          <ThemeProvider>
            <SidebarProvider>
              <body className="font-sans antialiased min-h-dvh" suppressHydrationWarning={true}>
                {children}
                <SecurityAlerts />
              </body>
            </SidebarProvider>
          </ThemeProvider>
        </SecurityProvider>
      </GoogleProvider>
    </html>
  );
}
