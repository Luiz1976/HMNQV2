'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Target, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface Question {
  id: string
  text: string
  dimension: string
}

const questions: Question[] = [
  // Autoconsciência (10 questões)
  { id: '1', text: 'Reconheço como minhas emoções afetam meu comportamento.', dimension: 'Autoconsciência' },
  { id: '2', text: 'Tenho consciência clara dos meus pontos fortes e fracos.', dimension: 'Autoconsciência' },
  { id: '3', text: 'Reflito regularmente sobre meu desempenho como líder.', dimension: 'Autoconsciência' },
  { id: '4', text: 'Estou aberto a feedbacks, mesmo quando são difíceis de ouvir.', dimension: 'Autoconsciência' },
  { id: '5', text: 'Sei identificar minhas reações automáticas em situações de estresse.', dimension: 'Autoconsciência' },
  { id: '6', text: 'Tenho clareza sobre meus valores pessoais.', dimension: 'Autoconsciência' },
  { id: '7', text: 'Reconheço quando estou errado em minhas decisões.', dimension: 'Autoconsciência' },
  { id: '8', text: 'Separo minhas emoções pessoais das necessidades da equipe.', dimension: 'Autoconsciência' },
  { id: '9', text: 'Busco entender como sou percebido pelos outros.', dimension: 'Autoconsciência' },
  { id: '10', text: 'Tenho um bom entendimento do impacto que causo nas pessoas.', dimension: 'Autoconsciência' },

  // Processamento Balanceado (10 questões)
  { id: '11', text: 'Levo em conta diferentes perspectivas antes de tomar uma decisão.', dimension: 'Processamento Balanceado' },
  { id: '12', text: 'Não deixo minhas emoções interferirem na análise de informações.', dimension: 'Processamento Balanceado' },
  { id: '13', text: 'Sou justo ao considerar as opiniões de membros da equipe.', dimension: 'Processamento Balanceado' },
  { id: '14', text: 'Tomo decisões com base em evidências, não apenas em intuição.', dimension: 'Processamento Balanceado' },
  { id: '15', text: 'Escuto com atenção antes de formar um julgamento.', dimension: 'Processamento Balanceado' },
  { id: '16', text: 'Evito favoritismos em decisões profissionais.', dimension: 'Processamento Balanceado' },
  { id: '17', text: 'Analiso os prós e contras antes de agir.', dimension: 'Processamento Balanceado' },
  { id: '18', text: 'Considero implicações éticas ao avaliar alternativas.', dimension: 'Processamento Balanceado' },
  { id: '19', text: 'Dou espaço para o contraditório nas reuniões.', dimension: 'Processamento Balanceado' },
  { id: '20', text: 'Respeito visões diferentes da minha ao tomar decisões.', dimension: 'Processamento Balanceado' },

  // Perspectiva Moral Internalizada (10 questões)
  { id: '21', text: 'Meus valores pessoais orientam minhas decisões.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '22', text: 'Sou consistente com meus princípios, mesmo sob pressão.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '23', text: 'Tenho integridade mesmo quando ninguém está observando.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '24', text: 'Evito decisões que vão contra meus valores.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '25', text: 'Rejeito atitudes antiéticas, mesmo que tragam resultados rápidos.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '26', text: 'Dou exemplo de conduta ética para minha equipe.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '27', text: 'Evito tomar decisões apenas para agradar superiores.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '28', text: 'Mantenho coerência entre o que digo e o que faço.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '29', text: 'Prezo pela justiça em todas as minhas ações.', dimension: 'Perspectiva Moral Internalizada' },
  { id: '30', text: 'Sinto-me mal quando ajo contra meus valores pessoais.', dimension: 'Perspectiva Moral Internalizada' },

  // Transparência de Relacionamentos (10 questões)
  { id: '31', text: 'Sou transparente ao me comunicar com a equipe.', dimension: 'Transparência de Relacionamentos' },
  { id: '32', text: 'Compartilho minhas intenções de forma clara e honesta.', dimension: 'Transparência de Relacionamentos' },
  { id: '33', text: 'Falo sobre minhas dificuldades com autenticidade.', dimension: 'Transparência de Relacionamentos' },
  { id: '34', text: 'Admito erros quando eles ocorrem.', dimension: 'Transparência de Relacionamentos' },
  { id: '35', text: 'Promovo confiança por meio da minha sinceridade.', dimension: 'Transparência de Relacionamentos' },
  { id: '36', text: 'Permito que os outros me conheçam de forma genuína.', dimension: 'Transparência de Relacionamentos' },
  { id: '37', text: 'Evito jogos políticos no ambiente de trabalho.', dimension: 'Transparência de Relacionamentos' },
  { id: '38', text: 'Expresso minhas emoções de forma apropriada no trabalho.', dimension: 'Transparência de Relacionamentos' },
  { id: '39', text: 'Mantenho coerência entre discurso e atitude.', dimension: 'Transparência de Relacionamentos' },
  { id: '40', text: 'Crio um ambiente onde todos se sintam seguros para se expressar.', dimension: 'Transparência de Relacionamentos' }
]

export default function HumaniqTelaTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [autoAdvance, setAutoAdvance] = useState(true)

  const currentQ = questions[currentQuestion]

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }))

    // Auto advance to next question after 1 second
    if (autoAdvance) {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
        } else {
          handleSubmit()
        }
      }, 1000)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log('Respostas:', answers)
      router.push('/colaborador/psicossociais/humaniq-tela/resultado')
    } catch (error) {
      console.error('Erro ao submeter respostas:', error)
      toast.error('Erro ao submeter respostas. Tente novamente.')
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header com gradiente roxo/azul */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">HUMANIQ TELA</h1>
              <p className="text-purple-100 text-sm">Teste de Liderança Autêntica</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-100">Questão</p>
            <p className="text-xl font-bold">{currentQuestion + 1}/40</p>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="w-full bg-purple-400/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Seção da dimensão */}
        <div className="mb-8">
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg inline-block">
            <p className="font-medium">{currentQ.dimension}</p>
          </div>
        </div>

        {/* Pergunta */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-gray-800 leading-relaxed">
            {currentQ.text}
          </h2>
        </div>

        {/* Escala Likert */}
        <div className="mb-12">
          {/* Labels da escala */}
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-red-600 font-medium">Discordo</span>
            <span className="text-yellow-600 font-medium">Neutro</span>
            <span className="text-green-600 font-medium">Concordo</span>
          </div>
          
          {/* Barra colorida */}
          <div className="h-2 bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 to-green-500 rounded-full mb-6" />
          
          {/* Botões da escala */}
          <div className="flex justify-between gap-4">
            {[
              { value: 1, color: 'bg-red-400 hover:bg-red-500', label: 'Discordo totalmente' },
              { value: 2, color: 'bg-orange-400 hover:bg-orange-500', label: 'Discordo' },
              { value: 3, color: 'bg-yellow-400 hover:bg-yellow-500', label: 'Neutro' },
              { value: 4, color: 'bg-green-400 hover:bg-green-500', label: 'Concordo' },
              { value: 5, color: 'bg-green-500 hover:bg-green-600', label: 'Concordo totalmente' }
            ].map((option) => (
              <div key={option.value} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    w-16 h-16 rounded-xl text-white font-bold text-xl transition-all duration-200
                    ${option.color}
                    ${answers[currentQ.id] === option.value 
                      ? 'ring-4 ring-purple-300 scale-110' 
                      : 'hover:scale-105'
                    }
                  `}
                >
                  {option.value}
                </button>
                <span className="text-xs text-gray-600 text-center max-w-20">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mensagem de seleção */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            {answers[currentQ.id] 
              ? 'Avançando automaticamente...' 
              : 'Selecione uma resposta para continuar'
            }
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}