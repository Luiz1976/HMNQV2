'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HumaniQClimaTestePage() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const totalQuestions = 60 // Baseado na configuração do teste humaniq-pesquisa-clima
  const testId = 'humaniq-pesquisa-clima'
  
  // Criar sessão de teste ao carregar a página
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch('/api/tests/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ testId }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setSessionId(data.sessionId)
        }
      } catch (error) {
        console.error('Erro ao criar sessão:', error)
      }
    }
    
    createSession()
  }, [])

  // Questões do teste HumaniQ Pesquisa de Clima - 60 questões organizadas em 12 categorias
  const questions = [
    // 1) Liderança & Confiança
    {
      id: 1,
      category: 'Liderança & Confiança',
      text: 'Sinto que minha liderança direta é acessível quando preciso.'
    },
    {
      id: 2,
      category: 'Liderança & Confiança',
      text: 'Minha liderança cumpre o que promete.'
    },
    {
      id: 3,
      category: 'Liderança & Confiança',
      text: 'Recebo orientações claras sobre prioridades.'
    },
    {
      id: 4,
      category: 'Liderança & Confiança',
      text: 'Confio nas decisões tomadas pela liderança.'
    },
    {
      id: 5,
      category: 'Liderança & Confiança',
      text: 'A liderança demonstra cuidado genuíno com as pessoas.'
    },
    // 2) Comunicação & Transparência
    {
      id: 6,
      category: 'Comunicação & Transparência',
      text: 'Informações importantes circulam com rapidez suficiente.'
    },
    {
      id: 7,
      category: 'Comunicação & Transparência',
      text: 'Compreendo os motivos por trás das decisões estratégicas.'
    },
    {
      id: 8,
      category: 'Comunicação & Transparência',
      text: 'Posso fazer perguntas sem receio de represálias.'
    },
    {
      id: 9,
      category: 'Comunicação & Transparência',
      text: 'A empresa é transparente sobre resultados e metas.'
    },
    {
      id: 10,
      category: 'Comunicação & Transparência',
      text: 'Reuniões e canais internos ajudam a evitar ruídos.'
    },
    // 3) Reconhecimento & Recompensas
    {
      id: 11,
      category: 'Reconhecimento & Recompensas',
      text: 'Meu bom trabalho é notado e reconhecido.'
    },
    {
      id: 12,
      category: 'Reconhecimento & Recompensas',
      text: 'Recebo feedback útil sobre meu desempenho.'
    },
    {
      id: 13,
      category: 'Reconhecimento & Recompensas',
      text: 'As promoções seguem critérios claros e justos.'
    },
    {
      id: 14,
      category: 'Reconhecimento & Recompensas',
      text: 'Sinto que minha remuneração é competitiva no mercado.'
    },
    {
      id: 15,
      category: 'Reconhecimento & Recompensas',
      text: 'Tenho oportunidades de ser reconhecido publicamente por contribuições.'
    },
    // 4) Trabalho & Carga (Demandas)
    {
      id: 16,
      category: 'Trabalho & Carga (Demandas)',
      text: 'Minha carga de trabalho é sustentável ao longo do tempo.'
    },
    {
      id: 17,
      category: 'Trabalho & Carga (Demandas)',
      text: 'Os prazos costumam ser realistas.'
    },
    {
      id: 18,
      category: 'Trabalho & Carga (Demandas)',
      text: 'Consigo fazer pausas adequadas durante o expediente.'
    },
    {
      id: 19,
      category: 'Trabalho & Carga (Demandas)',
      text: 'As demandas são distribuídas de forma equilibrada no time.'
    },
    {
      id: 20,
      category: 'Trabalho & Carga (Demandas)',
      text: 'Raramente preciso trabalhar além do horário.'
    },
    // 5) Recursos & Suporte ao Trabalho
    {
      id: 21,
      category: 'Recursos & Suporte ao Trabalho',
      text: 'Tenho ferramentas e sistemas adequados para executar minhas tarefas.'
    },
    {
      id: 22,
      category: 'Recursos & Suporte ao Trabalho',
      text: 'Os processos de trabalho facilitam, em vez de atrapalhar.'
    },
    {
      id: 23,
      category: 'Recursos & Suporte ao Trabalho',
      text: 'Recebo o apoio necessário de outras áreas quando dependo delas.'
    },
    {
      id: 24,
      category: 'Recursos & Suporte ao Trabalho',
      text: 'Tenho autonomia compatível com minhas responsabilidades.'
    },
    {
      id: 25,
      category: 'Recursos & Suporte ao Trabalho',
      text: 'As metas são acompanhadas com indicadores claros.'
    },
    // 6) Colaboração & Trabalho em Equipe
    {
      id: 26,
      category: 'Colaboração & Trabalho em Equipe',
      text: 'As pessoas do meu time se ajudam mutuamente.'
    },
    {
      id: 27,
      category: 'Colaboração & Trabalho em Equipe',
      text: 'Conflitos são tratados de forma construtiva.'
    },
    {
      id: 28,
      category: 'Colaboração & Trabalho em Equipe',
      text: 'Há respeito às diferenças de opiniões.'
    },
    {
      id: 29,
      category: 'Colaboração & Trabalho em Equipe',
      text: 'As áreas colaboram bem entre si.'
    },
    {
      id: 30,
      category: 'Colaboração & Trabalho em Equipe',
      text: 'Sinto que "estamos no mesmo barco".'
    },
    // 7) Segurança Psicológica
    {
      id: 31,
      category: 'Segurança Psicológica',
      text: 'Posso admitir erros sem medo de punição injusta.'
    },
    {
      id: 32,
      category: 'Segurança Psicológica',
      text: 'Ideias e sugestões são bem-vindas, mesmo quando contrariam o padrão.'
    },
    {
      id: 33,
      category: 'Segurança Psicológica',
      text: 'Sinto-me seguro para levantar problemas difíceis.'
    },
    {
      id: 34,
      category: 'Segurança Psicológica',
      text: 'Pessoas não são ridicularizadas por pedir ajuda.'
    },
    {
      id: 35,
      category: 'Segurança Psicológica',
      text: 'Divergências são vistas como oportunidade de aprendizado.'
    },
    // 8) Justiça & Ética Organizacional
    {
      id: 36,
      category: 'Justiça & Ética Organizacional',
      text: 'As regras são aplicadas de forma consistente.'
    },
    {
      id: 37,
      category: 'Justiça & Ética Organizacional',
      text: 'Decisões difíceis são tomadas considerando princípios éticos.'
    },
    {
      id: 38,
      category: 'Justiça & Ética Organizacional',
      text: 'Processos disciplinares são justos e transparentes.'
    },
    {
      id: 39,
      category: 'Justiça & Ética Organizacional',
      text: 'A empresa combate favoritismos.'
    },
    {
      id: 40,
      category: 'Justiça & Ética Organizacional',
      text: 'A comunicação oficial alinha discurso e prática.'
    },
    // 9) Desenvolvimento & Carreira
    {
      id: 41,
      category: 'Desenvolvimento & Carreira',
      text: 'Sei quais competências preciso desenvolver.'
    },
    {
      id: 42,
      category: 'Desenvolvimento & Carreira',
      text: 'Tenho acesso a treinamentos relevantes para minha função.'
    },
    {
      id: 43,
      category: 'Desenvolvimento & Carreira',
      text: 'Vejo perspectivas reais de crescimento aqui.'
    },
    {
      id: 44,
      category: 'Desenvolvimento & Carreira',
      text: 'Meus objetivos de carreira são conversados com minha liderança.'
    },
    {
      id: 45,
      category: 'Desenvolvimento & Carreira',
      text: 'Recebo oportunidades de assumir novos desafios.'
    },
    // 10) Propósito, Valores & Orgulho
    {
      id: 46,
      category: 'Propósito, Valores & Orgulho',
      text: 'Entendo como meu trabalho contribui para os resultados da empresa.'
    },
    {
      id: 47,
      category: 'Propósito, Valores & Orgulho',
      text: 'Identifico-me com os valores declarados pela organização.'
    },
    {
      id: 48,
      category: 'Propósito, Valores & Orgulho',
      text: 'Tenho orgulho de dizer que trabalho aqui.'
    },
    {
      id: 49,
      category: 'Propósito, Valores & Orgulho',
      text: 'A empresa gera impacto positivo para clientes e sociedade.'
    },
    {
      id: 50,
      category: 'Propósito, Valores & Orgulho',
      text: 'Sinto alinhamento entre o que a empresa diz e o que faz.'
    },
    // 11) Bem-estar & Equilíbrio Vida-Trabalho
    {
      id: 51,
      category: 'Bem-estar & Equilíbrio Vida-Trabalho',
      text: 'Consigo equilibrar trabalho e vida pessoal.'
    },
    {
      id: 52,
      category: 'Bem-estar & Equilíbrio Vida-Trabalho',
      text: 'A empresa apoia práticas saudáveis (ex.: pausas, ergonomia, programas).'
    },
    {
      id: 53,
      category: 'Bem-estar & Equilíbrio Vida-Trabalho',
      text: 'Sinto que minha saúde mental é levada a sério.'
    },
    {
      id: 54,
      category: 'Bem-estar & Equilíbrio Vida-Trabalho',
      text: 'Políticas de flexibilidade ajudam a lidar com imprevistos.'
    },
    {
      id: 55,
      category: 'Bem-estar & Equilíbrio Vida-Trabalho',
      text: 'O ambiente físico/virtual favorece o bem-estar.'
    },
    // 12) Gestão da Mudança & Inovação
    {
      id: 56,
      category: 'Gestão da Mudança & Inovação',
      text: 'Mudanças são comunicadas com antecedência e clareza.'
    },
    {
      id: 57,
      category: 'Gestão da Mudança & Inovação',
      text: 'Recebo apoio para adotar novos processos ou tecnologias.'
    },
    {
      id: 58,
      category: 'Gestão da Mudança & Inovação',
      text: 'Experimentação é encorajada e falhas são tratadas como aprendizado.'
    },
    {
      id: 59,
      category: 'Gestão da Mudança & Inovação',
      text: 'A organização reage rapidamente a novos desafios do mercado.'
    },
    {
      id: 60,
      category: 'Gestão da Mudança & Inovação',
      text: 'Ideias inovadoras são testadas e escaladas quando funcionam.'
    }
   ]

  const currentQuestionData = questions.find(q => q.id === currentQuestion) || questions[0]

  const handleAnswerSelect = async (value: number) => {
    // Aplicar lógica de inversão para o item 20 (questão com id 20)
    const finalValue = currentQuestion === 20 ? 6 - value : value;
    setSelectedAnswer(value)
    
    // Atualizar estado local
    const newAnswers = { ...answers, [currentQuestion]: finalValue };
    setAnswers(newAnswers);
    
    // Salvar respostas no localStorage para a página de resultados
    localStorage.setItem('humaniq-clima-respostas', JSON.stringify(newAnswers));
    
    // Salvar resposta na API (opcional)
    if (sessionId) {
      try {
        await fetch('/api/tests/save-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId,
            questionId: currentQuestion,
            value: finalValue,
            sessionId
          }),
        })
      } catch (error) {
        console.error('Erro ao salvar resposta:', error)
      }
    }
    
    // Verificar se é a última pergunta
    if (currentQuestion === totalQuestions) {
      // Finalizar teste automaticamente e redirecionar para resultados após 800ms
      setTimeout(() => {
        window.location.href = '/colaborador/corporativo/humaniq-pesquisa-clima/resultado'
      }, 800)
    } else {
      // Avanço automático para a próxima pergunta após 800ms
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(answers[currentQuestion + 1] || null)
      }, 800)
    }
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions && selectedAnswer !== null) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(answers[currentQuestion + 1] || null)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || null)
    }
  }

  const likertOptions = [
    { value: 1, label: 'Discordo totalmente', color: 'bg-red-300 hover:bg-red-400' },
    { value: 2, label: 'Discordo', color: 'bg-orange-300 hover:bg-orange-400' },
    { value: 3, label: 'Neutro', color: 'bg-yellow-300 hover:bg-yellow-400' },
    { value: 4, label: 'Concordo', color: 'bg-green-300 hover:bg-green-400' },
    { value: 5, label: 'Concordo totalmente', color: 'bg-green-400 hover:bg-green-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho roxo com gradiente */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo circular com ícone de alvo */}
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ CLIMA</h1>
                <p className="text-blue-100 text-sm">Clima Organizacional e Bem-Estar Psicológico</p>
              </div>
            </div>
            {/* Contador de questões */}
            <div className="text-right">
              <p className="text-blue-100 text-sm">Questão</p>
              <p className="text-2xl font-bold">{currentQuestion}/{totalQuestions}</p>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="mt-6 w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>



      {/* Área principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Categoria */}
          <div className="mb-6">
            <h2 className="text-purple-600 font-semibold text-lg mb-4">
              {currentQuestionData.category}
            </h2>
            
            {/* Pergunta */}
            <h3 className="text-gray-800 text-xl font-medium leading-relaxed mb-8">
              {currentQuestionData.text}
            </h3>
          </div>

          {/* Labels da escala */}
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span className="text-red-600 font-medium">Discordo</span>
            <span className="text-yellow-600 font-medium">Neutro</span>
            <span className="text-green-600 font-medium">Concordo</span>
          </div>

          {/* Barra de gradiente */}
          <div className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-400 rounded-full mb-8" />

          {/* Botões da escala Likert */}
          <div className="flex justify-between items-center mb-12">
            {likertOptions.map((option) => (
              <div key={option.value} className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-16 h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-xl font-bold ${
                    selectedAnswer === option.value
                      ? `${option.color} border-gray-400 shadow-lg scale-105`
                      : `${option.color} border-gray-300 hover:border-gray-400 hover:shadow-md`
                  }`}
                >
                  {option.value}
                </button>
                <span className="text-xs text-gray-600 text-center max-w-20 leading-tight">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé com navegação */}
      <div className="bg-white border-t border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Botão Anterior */}
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className="flex items-center space-x-2 px-6 py-3"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Button>

          {/* Texto central */}
          <div className="text-center">
            <p className="text-gray-600">
              {selectedAnswer === null 
                ? 'Selecione uma resposta para continuar'
                : 'Resposta selecionada'
              }
            </p>
          </div>

          {/* Botão Próxima */}
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null || currentQuestion === totalQuestions}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}