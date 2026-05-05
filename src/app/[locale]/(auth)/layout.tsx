import { ArrowLeft } from "lucide-react";
import { Link, redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ 
    children,
    params 
}: { 
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Auth');
    
    // Check for existing session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If user is already logged in, redirect to home
    if (user) {
        redirect({ href: '/home', locale });
    }

    return (
        <div className="min-h-screen">
            <Link 
                href="/" 
                className="flex items-center gap-2 absolute top-4 left-4 bg-white/5 backdrop-blur-md text-zinc-400 hover:text-white p-2.5 rounded-xl border border-white/10 transition-all hover:bg-white/10 group z-50"
            >
                <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 
                <span className="text-sm font-medium">{t('backToHome')}</span>
            </Link>
            {children}
        </div>
    )
}