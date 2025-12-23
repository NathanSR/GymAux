import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations('Common');

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1>{t('welcome')}</h1>
        </div>
    );
}
