
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade da plataforma HumaniQ AI',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        <p className="text-gray-600 mb-8">Última atualização: julho de 2025</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
            <p>A HumaniQ AI está comprometida com a proteção da privacidade e dos dados pessoais.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Dados Coletados</h2>
            <p>Coletamos dados necessários para fornecer nossos serviços de avaliação.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">3. Segurança</h2>
            <p>Implementamos medidas de segurança para proteger seus dados.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
