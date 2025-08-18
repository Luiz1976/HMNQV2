'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  text: string;
  dimension: string;
}

const questions: Question[] = [
  // Liderança Visionária
  { id: 1, text: "Tenho facilidade em inspirar os outros com uma visão de futuro.", dimension: "Liderança Visionária" },
  { id: 2, text: "Costumo alinhar a equipe com metas de longo prazo.", dimension: "Liderança Visionária" },
  { id: 3, text: "Comunico com clareza o propósito por trás das ações.", dimension: "Liderança Visionária" },
  { id: 4, text: "Acredito que líderes devem ser agentes de transformação.", dimension: "Liderança Visionária" },
  { id: 5, text: "Gosto de pensar em como o trabalho atual impacta o futuro.", dimension: "Liderança Visionária" },
  { id: 6, text: "Sei como motivar as pessoas a partir de ideias visionárias.", dimension: "Liderança Visionária" },
  
  // Liderança Afiliativa
  { id: 7, text: "Procuro manter um clima harmonioso e colaborativo.", dimension: "Liderança Afiliativa" },
  { id: 8, text: "Tenho empatia com os desafios pessoais da equipe.", dimension: "Liderança Afiliativa" },
  { id: 9, text: "Priorizar o bem-estar da equipe é um valor essencial para mim.", dimension: "Liderança Afiliativa" },
  { id: 10, text: "Escuto com atenção antes de tomar decisões.", dimension: "Liderança Afiliativa" },
  { id: 11, text: "Busco integrar todos com respeito e inclusão.", dimension: "Liderança Afiliativa" },
  { id: 12, text: "Relações interpessoais saudáveis são uma prioridade para mim.", dimension: "Liderança Afiliativa" },
  
  // Liderança Coaching
  { id: 13, text: "Gosto de desenvolver pessoas com base no seu potencial.", dimension: "Liderança Coaching" },
  { id: 14, text: "Valorizo conversas de feedback para crescimento individual.", dimension: "Liderança Coaching" },
  { id: 15, text: "Incentivo os membros da equipe a assumirem responsabilidade por seu desenvolvimento.", dimension: "Liderança Coaching" },
  { id: 16, text: "Ajudo minha equipe a definir objetivos pessoais e profissionais.", dimension: "Liderança Coaching" },
  { id: 17, text: "Sinto satisfação ao ver alguém crescer sob minha liderança.", dimension: "Liderança Coaching" },
  { id: 18, text: "Acredito que liderança é formar novos líderes.", dimension: "Liderança Coaching" },
  
  // Liderança Democrática/Participativa
  { id: 19, text: "Busco envolver a equipe nas decisões estratégicas.", dimension: "Liderança Democrática" },
  { id: 20, text: "Levo em consideração opiniões diversas antes de decidir.", dimension: "Liderança Democrática" },
  { id: 21, text: "Gosto de construir soluções colaborativamente.", dimension: "Liderança Democrática" },
  { id: 22, text: "Facilito reuniões onde todos têm voz.", dimension: "Liderança Democrática" },
  { id: 23, text: "Acredito que o melhor resultado vem do trabalho coletivo.", dimension: "Liderança Democrática" },
  { id: 24, text: "Prezo pela transparência e compartilhamento de informações.", dimension: "Liderança Democrática" },
  
  // Liderança Diretiva
  { id: 25, text: "Assumo o controle rapidamente em situações críticas.", dimension: "Liderança Diretiva" },
  { id: 26, text: "Gosto de definir com clareza o que deve ser feito e como.", dimension: "Liderança Diretiva" },
  { id: 27, text: "Acredito que algumas decisões devem ser centralizadas.", dimension: "Liderança Diretiva" },
  { id: 28, text: "Prefiro que a equipe siga minhas orientações à risca.", dimension: "Liderança Diretiva" },
  { id: 29, text: "Em momentos de crise, foco em agilidade, não em debate.", dimension: "Liderança Diretiva" },
  { id: 30, text: "A autoridade deve ser respeitada para o bom funcionamento da equipe.", dimension: "Liderança Diretiva" },
  
  // Liderança Pacesetting
  { id: 31, text: "Lidero pelo exemplo e alta performance pessoal.", dimension: "Liderança Pacesetting" },
  { id: 32, text: "Gosto de manter o ritmo acelerado na execução.", dimension: "Liderança Pacesetting" },
  { id: 33, text: "Busco excelência em tudo o que faço.", dimension: "Liderança Pacesetting" },
  { id: 34, text: "Cobro resultados com base nos meus próprios padrões.", dimension: "Liderança Pacesetting" },
  { id: 35, text: "Me frustro com lentidão ou falta de comprometimento.", dimension: "Liderança Pacesetting" },
  { id: 36, text: "Espero que a equipe acompanhe meu ritmo e dedicação.", dimension: "Liderança Pacesetting" },
  
  // Liderança Estratégica
  { id: 37, text: "Tomo decisões pensando nos impactos organizacionais.", dimension: "Liderança Estratégica" },
  { id: 38, text: "Tenho facilidade para analisar cenários complexos.", dimension: "Liderança Estratégica" },
  { id: 39, text: "Gosto de transformar informações em ações estratégicas.", dimension: "Liderança Estratégica" },
  { id: 40, text: "Penso no posicionamento da empresa ao liderar meu time.", dimension: "Liderança Estratégica" },
  { id: 41, text: "Equilibro a operação com visão de futuro.", dimension: "Liderança Estratégica" },
  { id: 42, text: "Enxergo o trabalho como parte de um sistema maior.", dimension: "Liderança Estratégica" },
  
  // Autoconhecimento e Inteligência Emocional
  { id: 43, text: "Reconheço minhas emoções e seus impactos no trabalho.", dimension: "Inteligência Emocional" },
  { id: 44, text: "Consigo manter a calma sob pressão.", dimension: "Inteligência Emocional" },
  { id: 45, text: "Aceito críticas com abertura e vontade de melhorar.", dimension: "Inteligência Emocional" },
  { id: 46, text: "Percebo quando estou agindo por impulso.", dimension: "Inteligência Emocional" },
  { id: 47, text: "Ajusto minha liderança conforme o perfil da equipe.", dimension: "Inteligência Emocional" },
  { id: 48, text: "Sou consciente dos meus pontos fortes e limitações.", dimension: "Inteligência Emocional" }
];

// Mapear dimensões para cores mais amigáveis
const dimensionColors: { [key: string]: string } = {
  "Liderança Visionária": "Visão e Inspiração",
  "Liderança Afiliativa": "Relacionamento e Harmonia", 
  "Liderança Coaching": "Desenvolvimento de Pessoas",
  "Liderança Democrática": "Participação e Colaboração",
  "Liderança Diretiva": "Direcionamento e Controle",
  "Liderança Pacesetting": "Ritmo e Excelência",
  "Liderança Estratégica": "Pensamento Estratégico",
  "Inteligência Emocional": "Autoconhecimento e Regulação"
};

export default function HumaniqLideraTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
    const updatedAnswers = {
      ...answers,
      [questions[currentQuestion].id]: value
    };
    setAnswers(updatedAnswers);
    
    // Avanço automático após 500ms para feedback visual
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(updatedAnswers[questions[currentQuestion + 1]?.id] || null);
      } else {
        // Salvar respostas no localStorage antes de finalizar
        localStorage.setItem('humaniq-lidera-answers', JSON.stringify(updatedAnswers));
        localStorage.setItem('humaniq-lidera-completed', new Date().toISOString());
        // Finalizar teste na última pergunta
        router.push('/colaborador/psicossociais/humaniq-lidera/resultado');
      }
    }, 500);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(answers[questions[currentQuestion + 1]?.id] || null);
      } else {
        // Salvar respostas no localStorage antes de finalizar
        localStorage.setItem('humaniq-lidera-answers', JSON.stringify(answers));
        localStorage.setItem('humaniq-lidera-completed', new Date().toISOString());
        // Finalizar teste
        router.push('/colaborador/psicossociais/humaniq-lidera/resultado');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1]?.id] || null);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header roxo escuro */}
      <div className="bg-purple-900 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo circular branco */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">HumaniQ LIDERA</h1>
                <p className="text-purple-100 text-sm">Perfil de Liderança Profissional</p>
              </div>
            </div>
            
            {/* Contador de questões */}
            <div className="text-white text-right">
              <div className="text-sm text-purple-100">Questão</div>
              <div className="text-2xl font-bold">{currentQuestion + 1}/48</div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Categoria da dimensão */}
        <div className="mb-6">
          <div className="text-purple-600 font-medium text-lg">
            {dimensionColors[currentQ.dimension] || currentQ.dimension}
          </div>
        </div>

        {/* Pergunta */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-gray-800 leading-relaxed">
            {currentQ.text}
          </h2>
        </div>

        {/* Labels da escala */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Discordo</span>
            <span>Neutro</span>
            <span>Concordo</span>
          </div>
        </div>

        {/* Barra de gradiente colorido */}
        <div className="mb-8">
          <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full"></div>
        </div>

        {/* Escala Likert com 5 pontos coloridos */}
        <div className="mb-12">
          <div className="flex justify-between items-center gap-4">
            {[1, 2, 3, 4, 5].map((value) => {
              const colors = {
                1: 'bg-red-400 hover:bg-red-500',
                2: 'bg-orange-400 hover:bg-orange-500', 
                3: 'bg-yellow-400 hover:bg-yellow-500',
                4: 'bg-green-400 hover:bg-green-500',
                5: 'bg-green-600 hover:bg-green-700'
              };
              
              const labels = {
                1: 'Discordo totalmente',
                2: 'Discordo',
                3: 'Neutro',
                4: 'Concordo', 
                5: 'Concordo totalmente'
              };

              return (
                <div key={value} className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => handleAnswerSelect(value)}
                    className={`
                      w-16 h-16 rounded-xl text-white font-bold text-xl transition-all duration-200
                      ${colors[value as keyof typeof colors]}
                      ${selectedAnswer === value ? 'ring-4 ring-purple-300 scale-110' : 'hover:scale-105'}
                      shadow-lg hover:shadow-xl
                    `}
                  >
                    {value}
                  </button>
                  <span className="text-xs text-gray-600 text-center max-w-20">
                    {labels[value as keyof typeof labels]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="text-gray-500 text-sm">
            {selectedAnswer ? 'Avançando automaticamente...' : 'Selecione uma resposta'}
          </div>

          {/* Botão Finalizar aparece apenas na última pergunta e após resposta */}
          {currentQuestion === questions.length - 1 && selectedAnswer && (
            <Button
              onClick={() => router.push('/colaborador/psicossociais/humaniq-lidera/resultado')}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Finalizar
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          
          {/* Espaço vazio quando não há botão finalizar */}
          {!(currentQuestion === questions.length - 1 && selectedAnswer) && (
            <div className="w-24"></div>
          )}
        </div>
      </div>
    </div>
  );
}