'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { useForm } from 'react-hook-form'
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UpdatePasswordFormData = {
  password: string
  confirmPassword: string
}

export default function UpdatePasswordPage() {
  const t = useTranslations('Auth')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UpdatePasswordFormData>()

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">{t('passwordUpdated')}</h1>
          <p className="text-zinc-400 font-medium">{t('redirectingToLogin')}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-lime-500 text-black mb-8 rotate-3 shadow-xl shadow-lime-500/20"
          >
            <Lock size={40} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
            {t('updatePasswordTitle')}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 font-medium">
            {t('updatePasswordDescription')}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold"
          >
            <AlertCircle size={18} />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1 group-focus-within:text-lime-500">
              {t('newPasswordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-500">
                <Lock size={20} />
              </div>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type="password"
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-lime-500/50 outline-none text-zinc-900 dark:text-white font-medium"
              />
            </div>
            {errors.password && <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">{t('errors.required')}</span>}
          </div>

          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1 group-focus-within:text-lime-500">
              {t('confirmPasswordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-500">
                <Lock size={20} />
              </div>
              <input
                {...register('confirmPassword', {
                  required: true,
                  validate: (val: string) => {
                    if (watch('password') !== val) {
                      return t('errors.mismatch')
                    }
                  }
                })}
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-lime-500/50 outline-none text-zinc-900 dark:text-white font-medium"
              />
            </div>
            {errors.confirmPassword && <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.confirmPassword.message || t('errors.required')}</span>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-lime-500 text-black font-black uppercase tracking-widest shadow-lg shadow-lime-500/20 mt-6 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                <span>{t('updatePasswordButton')}</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
