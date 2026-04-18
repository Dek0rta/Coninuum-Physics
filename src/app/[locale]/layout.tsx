import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { Toaster } from "sonner";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Continuum Physics — Interactive Learning Platform",
  description:
    "Master physics through interactive simulations, quizzes, and a live MMR ranking system",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = JSON.parse(localStorage.getItem('continuum-theme') || '{}')?.state?.theme || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Header locale={locale} />
            <PageTransition>{children}</PageTransition>
            <Toaster
              richColors
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                },
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
