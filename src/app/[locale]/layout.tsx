import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gym App",
	description: "Controle de treino",
	manifest: "/manifest.json", // Adicione esta linha
	// themeColor: "#3b82f6",      // Cor da barra de status no celular
};

export const viewport = {
	themeColor: "#3b82f6",
};

export default async function RootLayout(props: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>; // Defina como Promise
}) {

	const { locale } = await props.params;
	const children = props.children;

	// Verifica se o locale é válido
	if (!routing.locales.includes(locale as any)) notFound();

	// Obtém as mensagens para o idioma
	const messages = await getMessages();

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased light`}
			>
				<NextIntlClientProvider messages={messages}>
					<LanguageProvider>
						<ThemeProvider>
							{children}
						</ThemeProvider>
					</LanguageProvider>
				</NextIntlClientProvider>
				<ToastContainer pauseOnHover closeOnClick draggable />
			</body>
		</html>
	);
}
