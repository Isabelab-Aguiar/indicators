'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!user) router.replace('/login')
    else if (user.role !== 'admin') router.replace('/dashboard')
  }, [hydrated, user, router])

  if (!hydrated || !user || user.role !== 'admin') return null

  return <>{children}</>
}
