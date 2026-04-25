import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from '@/context/AuthContext';
import ClientLayout from "@/components/ClientLayout";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800']
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  variable: '--font-title',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: "Stela Finance - Financial Intelligence",
  description: "Inteligência financeira para o seu negócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", plusJakarta.variable, cormorant.variable)} suppressHydrationWarning>
      <body className={`${plusJakarta.className} bg-[#f8f9fa] text-[#1a1a1a] antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
