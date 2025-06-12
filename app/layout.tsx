import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { ConnectionStatus } from '@/components/debug/ConnectionStatus';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Crisis Data Response Platform",
  description: "Empowering first responders and emergency management teams to coordinate disaster relief efforts through real-time data visualization and collaborative response management.",
  keywords: ["emergency response", "disaster relief", "crisis management", "first responders", "emergency coordination"],
  authors: [{ name: "CDRP Team" }],
  openGraph: {
    title: "Crisis Data Response Platform",
    description: "Real-time emergency response coordination platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ConnectionStatus />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
              maxWidth: '320px',
              wordBreak: 'break-word',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
          containerStyle={{
            bottom: 20,
            right: 20,
            left: 'auto',
          } as React.CSSProperties}
        />
      </body>
    </html>
  );
}
