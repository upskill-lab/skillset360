'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const SignUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  fullName: z.string().min(2, 'Nombre requerido').optional(),
})

const SignInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

function encodeError(msg: string) {
  return encodeURIComponent(msg)
}

export async function signUp(formData: FormData): Promise<void> {
  const parsed = SignUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
  })

  if (!parsed.success) {
    redirect(
      `/signup?error=${encodeError(parsed.error.issues[0]?.message ?? 'Error de validación')}`,
    )
  }

  const { email, password, fullName } = parsed.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    const msg = error.message.includes('already registered')
      ? 'Ya tenés cuenta, iniciá sesión.'
      : error.message
    redirect(`/signup?error=${encodeError(msg)}`)
  }

  redirect('/signup?success=1')
}

export async function signIn(formData: FormData): Promise<void> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect(
      `/login?error=${encodeError(parsed.error.issues[0]?.message ?? 'Error de validación')}`,
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    redirect(`/login?error=${encodeError('Email o contraseña incorrectos.')}`)
  }

  const next = (formData.get('next') as string) || '/dashboard'
  redirect(next)
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const next = (formData.get('next') as string) || '/dashboard'
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${next}`,
    },
  })

  if (error) redirect(`/login?error=${encodeError(error.message)}`)
  if (data.url) redirect(data.url)
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function requestPasswordReset(formData: FormData): Promise<void> {
  const email = z.string().email().safeParse(formData.get('email'))
  if (!email.success) {
    redirect(`/forgot-password?error=${encodeError('Email inválido.')}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  })

  if (error?.message.includes('rate')) {
    redirect(`/forgot-password?error=${encodeError('Demasiados intentos. Intentá en una hora.')}`)
  }

  // Always show success to avoid email enumeration
  redirect('/forgot-password?success=1')
}

export async function updatePassword(formData: FormData): Promise<void> {
  const schema = z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')

  const parsed = schema.safeParse(formData.get('password'))
  if (!parsed.success) {
    redirect(
      `/reset-password?error=${encodeError(parsed.error.issues[0]?.message ?? 'Contraseña inválida')}`,
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data })

  if (error) redirect(`/reset-password?error=${encodeError(error.message)}`)

  redirect('/dashboard')
}
