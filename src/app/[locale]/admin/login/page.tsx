'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/routing'
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

type AdminLoginFormData = {
  email: string
  password: string
}

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminLoginFormData>()

  const onSubmit = async (data: AdminLoginFormData) => {
    setLoading(true)
    setAuthError(null)

    try {
      // 1. Faz login no Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        setAuthError(error.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        // 2. Busca perfil para verificar role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .maybeSingle()

        if (profileError || !profile || profile.role !== 'admin') {
          // Desloga imediatamente se não for admin
          await supabase.auth.signOut()
          setAuthError('Acesso restrito. Este usuário não possui privilégios de administrador.')
          setLoading(false)
          return
        }

        // 3. Sucesso!
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin')
        }, 1500)
      }
    } catch (err) {
      setAuthError('Ocorreu um erro inesperado ao autenticar.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-24 h-24 rounded-3xl bg-lime-500/20 flex items-center justify-center mb-2 border border-lime-500/30 shadow-2xl shadow-lime-500/10"
          >
            <CheckCircle2 className="w-14 h-14 text-lime-400" />
          </motion.div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-lime-400">Acesso Autorizado</h1>
          <p className="text-zinc-400 font-medium">Carregando painel de controle...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 sm:p-8 relative overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-900/50 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center relative">
          <motion.div
            whileHover={{ rotate: -3, scale: 1.05 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 text-lime-400 mb-6 shadow-2xl shadow-lime-500/5 cursor-default group"
          >
            <ShieldCheck size={40} className="group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
            GymAux <span className="text-lime-400">Admin</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            Identifique-se para acessar as ferramentas administrativas do sistema.
          </p>
        </div>

        {/* Notifications */}
        <AnimatePresence mode="wait">
          {authError && (
            <motion.div
              key="error"
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold overflow-hidden"
            >
              <AlertCircle size={18} className="shrink-0" />
              <p className="leading-snug">{authError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 group-focus-within:text-lime-400 transition-colors">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-lime-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                {...register('email', {
                  required: 'E-mail obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de e-mail inválido'
                  }
                })}
                type="email"
                placeholder="nome@gymaux.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 focus:border-lime-500/50 focus:bg-zinc-900/80 transition-all outline-none text-white font-medium placeholder-zinc-600 text-sm"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 group-focus-within:text-lime-400 transition-colors">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-lime-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                {...register('password', {
                  required: 'Senha obrigatória',
                  minLength: {
                    value: 6,
                    message: 'A senha deve conter no mínimo 6 caracteres'
                  }
                })}
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 focus:border-lime-500/50 focus:bg-zinc-900/80 transition-all outline-none text-white font-medium placeholder-zinc-600 text-sm"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-lime-400 disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-950 font-black uppercase tracking-widest transition-all shadow-xl shadow-lime-500/10 mt-6 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skewed-x-12" />
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Autenticar</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors py-2 px-4 rounded-xl"
          >
            Voltar ao site
          </a>
        </div>
      </motion.div>
    </div>
  )
}
