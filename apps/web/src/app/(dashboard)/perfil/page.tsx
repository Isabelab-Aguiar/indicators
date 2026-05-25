import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { ProfileForm } from '@/components/profile/profile-form'

export const metadata: Metadata = { title: 'Perfil' }

export default function PerfilPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Meu Perfil" description="Gerencie suas informações pessoais" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
