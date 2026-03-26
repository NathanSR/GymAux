import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Auth');

    return (
        <div className="min-h-screen">
            <Link 
                href="/" 
                className="flex items-center gap-2 absolute top-4 left-4 bg-white/5 backdrop-blur-md text-zinc-400 hover:text-white p-2.5 rounded-xl border border-white/10 transition-all hover:bg-white/10 group"
            >
                <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 
                <span className="text-sm font-medium">{t('backToHome')}</span>
            </Link>
            {children}
        </div>
    )
}