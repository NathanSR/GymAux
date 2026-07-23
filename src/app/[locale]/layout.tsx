import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "@/context/ThemeContext";
import { DialogProvider } from "@/context/DialogContext";
import { OfflineSyncProvider } from "@/context/OfflineSyncProvider";
import { NavigationLoadingProvider } from "@/context/NavigationLoadingContext";
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';

import { AppSplashScreen } from "@/components/ui/AppSplashScreen";

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
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "GymAux",
	},
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/ios/32.png", sizes: "32x32", type: "image/png" },
			{ url: "/ios/192.png", sizes: "192x192", type: "image/png" },
		],
		apple: [
			{ url: "/ios/180.png", sizes: "180x180", type: "image/png" },
			{ url: "/ios/192.png", sizes: "192x192", type: "image/png" },
			{ url: "/ios/512.png", sizes: "512x512", type: "image/png" },
		],
	},
	other: {
		"mobile-web-app-capable": "yes",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#09090b" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
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
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextTopLoader color="#a3e635" />
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						<DialogProvider>
							<OfflineSyncProvider>
								<NavigationLoadingProvider>
									<AppSplashScreen />
									{children}
								</NavigationLoadingProvider>
							</OfflineSyncProvider>
						</DialogProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
				<ToastContainer pauseOnHover closeOnClick draggable />
			</body>
		</html>
	);
}
