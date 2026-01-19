import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/layout/AuthProvider";
import { getWhiteLabelTenant } from "@/lib/tenant";
import ThemeProvider from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "Construction Platform",
  description: "Multi-tenant construction materials & contracting platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getWhiteLabelTenant();

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {tenant ? (
            <ThemeProvider branding={tenant.branding}>
              {children}
            </ThemeProvider>
          ) : (
            children
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
