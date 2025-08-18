import { Metadata } from 'next'
import { IndividualInviteContent } from './_components/individual-invite-content'

export const metadata: Metadata = {
  title: 'Convite Individual | HumaniQ AI',
  description: 'Gere convites personalizados para colaboradores e candidatos',
}

export default function IndividualInvitePage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Convite Individual</h1>
        <p className="text-gray-600 mt-2">
          Gere convites personalizados para colaboradores ou candidatos realizarem testes psicossociais
        </p>
      </div>
      
      <IndividualInviteContent />
    </div>
  )
}