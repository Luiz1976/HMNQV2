
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso da plataforma HumaniQ AI',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        <p className="text-gray-600 mb-8">Última atualização: julho de 2025</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar o HumaniQ AI, você concorda em cumprir estes Termos de Uso.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p>O HumaniQ AI é uma plataforma SaaS para avaliações psicossociais com IA.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">3. Uso Permitido</h2>
            <p>A plataforma deve ser usada apenas para fins legítimos e éticos.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
