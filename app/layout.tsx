import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perguntas frequentes sobre satisfação do cliente",
  description: "Este sistema foi criado para coletar feedback dos usuários com o objetivo de aprimorar a qualidade do nosso serviço e produto. Observe que as informações fornecidas em nossos formulários são confidenciais e não serão divulgadas ou compartilhadas com nenhuma instituição pública ou privada para benefício interno ou externo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
