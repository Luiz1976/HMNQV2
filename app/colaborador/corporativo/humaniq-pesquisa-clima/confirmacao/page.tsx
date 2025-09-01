'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Building2, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HumaniQClimaConfirmacaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    // Simular carregamento e obter dados do usuário
    const loadUserData = async () => {
      try {
        // Aqui você pode fazer uma chamada real para a API para obter dados do usuário
        // Por enquanto, vamos usar dados simulados
        setUserName('Colaborador')
        setCompanyName('Sua Empresa')
        
        // Simular tempo de processamento
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleBackToTests = () => {
    router.push('/colaborador/corporativo')
  }



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">Processando suas respostas...</p>
            <p className="text-sm text-gray-500">Enviando resultados para sua empresa</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Teste Concluído com Sucesso!</h1>
            <p className="text-blue-100 text-lg">HumaniQ Pesquisa de Clima Organizacional</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Success Message Card */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-800 mb-2">
                Resultados Enviados à Empresa
              </CardTitle>
              <p className="text-green-700 text-lg">
                Suas respostas foram processadas e enviadas com sucesso para {companyName}
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Empresa:</span>
                  <span>{companyName}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Data de Envio:</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-purple-600" />
                <span>O que acontece agora?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Análise dos Dados</h4>
                    <p className="text-gray-600 text-sm">
                      Suas respostas serão analisadas junto com as de outros colaboradores para gerar insights sobre o clima organizacional.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Relatório Consolidado</h4>
                    <p className="text-gray-600 text-sm">
                      A empresa receberá um relatório consolidado com recomendações para melhoria do ambiente de trabalho.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Confidencialidade</h4>
                    <p className="text-gray-600 text-sm">
                      Suas respostas individuais são confidenciais e serão utilizadas apenas para análises estatísticas agregadas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Card */}
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Obrigado pela sua participação!
              </h3>
              <p className="text-gray-600 mb-6">
                Sua contribuição é fundamental para construir um ambiente de trabalho melhor para todos.
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={handleBackToTests}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                >
                  <span>Voltar aos Testes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}