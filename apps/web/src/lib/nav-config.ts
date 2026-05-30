import { BookOpen, History, LayoutDashboard, User, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gestantes', label: 'Gestantes', icon: Users },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/boas-praticas', label: 'Boas Práticas', icon: BookOpen },
]

export const BOTTOM_NAV_ITEMS = [{ href: '/perfil', label: 'Perfil', icon: User }]
