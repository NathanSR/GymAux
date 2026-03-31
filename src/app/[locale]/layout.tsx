import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "@/context/ThemeContext";
import { OfflineSyncProvider } from "@/context/OfflineSyncProvider";
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gym Aux",
	description: "Meu Treino Diário",
	manifest: "/manifest.json", 
};

export const viewport = {
	themeColor: "#3b82f6",
};

export default async function RootLayout(props: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>; 
}) {

	const { locale } = await props.params;
	const children = props.children;

	if (!routing.locales.includes(locale as any)) notFound();

	const messages = await getMessages();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextTopLoader color="#a3e635" />
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						<OfflineSyncProvider>
							{children}
						</OfflineSyncProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
				<ToastContainer pauseOnHover closeOnClick draggable />
			</body>
		</html>
	);
}
