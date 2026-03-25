'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { migrateLocalData } from '@/lib/migration/migrateLocalData'
import { Link, useRouter } from '@/i18n/routing'
import { UserPlus, ArrowRight, Loader2, CheckCircle2, Mail, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

type AuthFormData = {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const t = useTranslations('Auth')
  const [loading, setLoading] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AuthFormData>()

  const password = watch('password')

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setAuthError(null)

    try {
      if (data.password !== data.confirmPassword) {
        setAuthError(t('errors.mismatch'))
        setLoading(false)
        return
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      })

      if (error) {
        setAuthError(error.message)
      } else if (authData.user) {
        if (authData.session) {
          setMigrating(true)
          try {
            await migrateLocalData()
            setMigrated(true)
            setTimeout(() => router.push('/home'), 1500)
          } catch (err) {
            console.error("Erro na migração:", err)
            router.push('/home')
          }
        } else {
          alert(t('confirmEmail'))
          router.push('/login')
        }
      }
    } catch (err) {
      setAuthError("Ocorreu um erro inesperado.")
    } finally {
      if (!migrating && !migrated) {
        setLoading(false)
      }
    }
  }

  if (migrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 rounded-full bg-lime-500/20 flex items-center justify-center mb-2"
          >
            <CheckCircle2 className="w-12 h-12 text-lime-500" />
          </motion.div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">{t('synced')}</h1>
          <p className="text-zinc-400 font-medium">{t('redirecting')}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 p-6 sm:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center relative">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-lime-500 text-black mb-8 rotate-3 shadow-xl shadow-lime-500/20 cursor-default"
          >
            <UserPlus size={40} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
            {t('titleRegister')}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-base font-medium max-w-[280px] mx-auto leading-relaxed">
            {t('descriptionRegister')}
          </p>
        </div>

        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold overflow-hidden"
            >
              <AlertCircle size={18} className="shrink-0" />
              <p>{authError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1 group-focus-within:text-lime-500 transition-colors">
              {t('nameLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-500 transition-colors">
                <User size={20} />
              </div>
              <input
                {...register('name', { required: true })}
                placeholder={t('namePlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-lime-500/50 focus:bg-white dark:focus:bg-zinc-800 transition-all outline-none text-zinc-900 dark:text-white font-medium"
              />
            </div>
            {errors.name && <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">{t('errors.required')}</span>}
          </div>

          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1 group-focus-within:text-lime-500 transition-colors">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                })}
                type="email"
                placeholder={t('emailPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-lime-500/50 focus:bg-white dark:focus:bg-zinc-800 transition-all outline-none text-zinc-900 dark:text-white font-medium"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                {errors.email.type === 'pattern' ? t('errors.invalidEmail') : t('errors.required')}
              </span>
            )}
          </div>

          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1 group-focus-within:text-lime-500 transition-colors">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type="password"
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-lime-500/50 focus:bg-white dark:focus:bg-zinc-800 transition-all outline-none text-zinc-900 dark:text-white font-medium"
              />
            </div>
            {errors.password && <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">{t('errors.required')}</span>}
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="space-y-1.5 group overflow-hidden"
          >
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1 group-focus-within:text-lime-500 transition-colors">
              {t('confirmPasswordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-500 transition-colors">
                <ShieldCheck size={20} />
              </div>
              <input
                {...register('confirmPassword', {
                  required: true,
                  validate: (value) => value === password || t('errors.mismatch')
                })}
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-lime-500/50 focus:bg-white dark:focus:bg-zinc-800 transition-all outline-none text-zinc-900 dark:text-white font-medium"
              />
            </div>
            {errors.confirmPassword && <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.confirmPassword.message}</span>}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || migrating}
            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-lime-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-black font-black uppercase tracking-widest transition-all shadow-lg shadow-lime-500/20 mt-6 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skewed-x-12" />
            {loading || migrating ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                <span className="relative z-10">{migrating ? t('syncing') : t('processing')}</span>
              </>
            ) : (
              <>
                <span className="relative z-10">{t('registerButton')}</span>
                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="inline-block relative">
            <motion.span
              whileHover={{ color: '#84cc16' }}
              className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors py-2 px-4 rounded-xl hover:bg-lime-500/5 block"
            >
              {t('hasAccount')}
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
