'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Home, TrendingUp, Brain, Target, Users, Award, BookOpen, Lightbulb, Printer } from 'lucide-react';

interface DimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}

const dimensionDescriptions = {
  'Visionário': 'Capacidade de inspirar e motivar através de uma visão clara do futuro.',
  'Afiliativo': 'Habilidade de criar harmonia e construir relacionamentos positivos.',
  'Coaching': 'Competência para desenvolver pessoas e melhorar seu desempenho.',
  'Democrático': 'Capacidade de envolver a equipe nas decisões e valorizar contribuições.',
  'Diretivo': 'Habilidade de dar direções claras e tomar decisões rápidas.',
  'Pacesetting': 'Competência para estabelecer padrões altos e liderar pelo exemplo.',
  'Estratégico': 'Capacidade de pensar a longo prazo e planejar estrategicamente.',
  'Inteligência Emocional': 'Habilidade de gerenciar emoções próprias e dos outros.'
};

export default function HumaniqLideraResultado() {
  const router = useRouter();
  const [scores, setScores] = useState<DimensionScore[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para calcular scores reais baseado nas respostas
  const calculateRealScores = (answersObj: { [key: number]: number }): DimensionScore[] => {
    // Mapeamento das perguntas para dimensões (6 perguntas por dimensão)
    // As perguntas têm IDs de 1-48, não índices 0-47
    const dimensionMapping = {
      'Liderança Visionária': [1, 2, 3, 4, 5, 6],
      'Liderança Afiliativa': [7, 8, 9, 10, 11, 12],
      'Liderança Coaching': [13, 14, 15, 16, 17, 18],
      'Liderança Democrática': [19, 20, 21, 22, 23, 24],
      'Liderança Diretiva': [25, 26, 27, 28, 29, 30],
      'Liderança Pacesetting': [31, 32, 33, 34, 35, 36],
      'Liderança Estratégica': [37, 38, 39, 40, 41, 42],
      'Inteligência Emocional': [43, 44, 45, 46, 47, 48]
    };

    const dimensionNames = {
      'Liderança Visionária': 'Visionário',
      'Liderança Afiliativa': 'Afiliativo',
      'Liderança Coaching': 'Coaching',
      'Liderança Democrática': 'Democrático',
      'Liderança Diretiva': 'Diretivo',
      'Liderança Pacesetting': 'Pacesetting',
      'Liderança Estratégica': 'Estratégico',
      'Inteligência Emocional': 'Inteligência Emocional'
    };

    const results: DimensionScore[] = [];

    Object.entries(dimensionMapping).forEach(([fullDimension, questionIds]) => {
       const dimensionName = dimensionNames[fullDimension as keyof typeof dimensionNames];
       let totalScore = 0;
       
       // Somar as respostas das 6 perguntas desta dimensão
       questionIds.forEach(questionId => {
         if (answersObj[questionId] !== undefined) {
           totalScore += answersObj[questionId];
         }
       });

      const maxScore = 30; // 6 perguntas × 5 pontos máximos = 30
      const percentage = Math.round((totalScore / maxScore) * 100);

      results.push({
        dimension: dimensionName,
        score: totalScore,
        maxScore: maxScore,
        percentage: percentage,
        description: dimensionDescriptions[dimensionName as keyof typeof dimensionDescriptions]
      });
    });

    return results;
  };

  useEffect(() => {
    // Recuperar respostas do localStorage
    const savedAnswers = localStorage.getItem('humaniq-lidera-answers');
    const testCompleted = localStorage.getItem('humaniq-lidera-completed');

    if (savedAnswers && testCompleted) {
       try {
         const answers: { [key: number]: number } = JSON.parse(savedAnswers);
         const calculatedScores = calculateRealScores(answers);
        
        setTimeout(() => {
          setScores(calculatedScores);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao processar respostas:', error);
        // Redirecionar para o teste se houver erro
        router.push('/colaborador/psicossociais/humaniq-lidera');
      }
    } else {
      // Se não há respostas salvas, redirecionar para o teste
      router.push('/colaborador/psicossociais/humaniq-lidera');
    }
  }, [router]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando seus resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-purple-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-900 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ LIDERA</h1>
                <p className="text-purple-200">Resultados do Teste de Liderança</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-md print:shadow-none print:border print:border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo dos Resultados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{scores.length}</div>
              <div className="text-sm text-gray-600">Dimensões Avaliadas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(scores.reduce((acc, score) => acc + score.percentage, 0) / scores.length)}%
              </div>
              <div className="text-sm text-gray-600">Pontuação Média</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scores.find(s => s.percentage === Math.max(...scores.map(s => s.percentage)))?.dimension}
              </div>
              <div className="text-sm text-gray-600">Dimensão Mais Forte</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md print:shadow-none print:border print:border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Resultados por Dimensão</h2>
          <div className="space-y-6">
            {scores.map((score, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{score.dimension}</h3>
                  <span className={`font-semibold ${getScoreColor(score.percentage)}`}>
                    {score.score}/{score.maxScore} ({score.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getBarColor(score.percentage)}`}
                    style={{ width: `${score.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{score.description}</p>
              </div>
            ))}
          </div>
        </div>



        {/* Análise Detalhada: Resultados do Teste de Liderança */}
        <div className="bg-white rounded-lg shadow-md print:shadow-none print:border print:border-gray-300 p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Análise Detalhada: Resultados do Teste de Liderança</h2>
          </div>

          {/* Contextualização Científica */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Fundamentação Teórica</h3>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                O HumaniQ LIDERA baseia-se nos modelos contemporâneos de liderança situacional e competências emocionais, 
                integrando as teorias de Goleman sobre estilos de liderança e a abordagem de Bass sobre liderança transformacional. 
                O instrumento avalia oito dimensões críticas que determinam a eficácia da liderança em contextos organizacionais complexos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cada dimensão representa um conjunto específico de competências comportamentais e cognitivas que, 
                quando desenvolvidas de forma integrada, potencializam a capacidade de influenciar, motivar e 
                dirigir equipes em direção aos objetivos organizacionais.
              </p>
            </div>
          </div>

          {/* Análise dos Resultados do Usuário */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Análise dos Seus Resultados</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Pontos Fortes Identificados</h4>
                </div>
                <div className="space-y-2">
                  {scores
                    .filter(score => score.percentage >= 70)
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 3)
                    .map((score, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">{score.dimension}</span>
                        <span className="text-green-600 font-bold">{score.percentage}%</span>
                      </div>
                    ))
                  }
                </div>
                {scores.filter(score => score.percentage >= 70).length === 0 && (
                  <p className="text-green-700">Todas as dimensões apresentam potencial de desenvolvimento.</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">Áreas de Desenvolvimento</h4>
                </div>
                <div className="space-y-2">
                  {scores
                    .filter(score => score.percentage < 70)
                    .sort((a, b) => a.percentage - b.percentage)
                    .slice(0, 3)
                    .map((score, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-amber-700 font-medium">{score.dimension}</span>
                        <span className="text-amber-600 font-bold">{score.percentage}%</span>
                      </div>
                    ))
                  }
                </div>
                {scores.filter(score => score.percentage < 70).length === 0 && (
                  <p className="text-amber-700">Excelente desempenho em todas as dimensões avaliadas.</p>
                )}
              </div>
            </div>

            {/* Interpretação Personalizada */}
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Interpretação do Perfil de Liderança</h4>
              {(() => {
                const averageScore = Math.round(scores.reduce((acc, score) => acc + score.percentage, 0) / scores.length);
                if (averageScore >= 80) {
                  return (
                    <p className="text-blue-700 leading-relaxed">
                      <strong>Perfil de Liderança Excepcional:</strong> Seus resultados indicam um desenvolvimento avançado 
                      nas competências de liderança. Você demonstra capacidade para exercer liderança transformacional, 
                      adaptando seu estilo às necessidades situacionais e mantendo alta eficácia na gestão de equipes. 
                      Recomenda-se focar no refinamento de técnicas avançadas e no desenvolvimento de outros líderes.
                    </p>
                  );
                } else if (averageScore >= 65) {
                  return (
                    <p className="text-blue-700 leading-relaxed">
                      <strong>Perfil de Liderança Competente:</strong> Você apresenta um bom nível de desenvolvimento 
                      nas competências de liderança, com algumas dimensões destacando-se positivamente. 
                      Há oportunidades claras de crescimento que, quando trabalhadas, podem elevar significativamente 
                      sua eficácia como líder. Foque no desenvolvimento das áreas com menor pontuação.
                    </p>
                  );
                } else if (averageScore >= 50) {
                  return (
                    <p className="text-blue-700 leading-relaxed">
                      <strong>Perfil de Liderança em Desenvolvimento:</strong> Seus resultados sugerem que você está 
                      em processo de desenvolvimento das competências de liderança. Existe um potencial considerável 
                      para crescimento através de treinamento estruturado, mentoria e experiências práticas de liderança. 
                      Recomenda-se um plano de desenvolvimento focado e sistemático.
                    </p>
                  );
                } else {
                  return (
                    <p className="text-blue-700 leading-relaxed">
                      <strong>Perfil de Liderança Inicial:</strong> Os resultados indicam que você está no início 
                      da jornada de desenvolvimento das competências de liderança. Este é um momento excelente para 
                      investir em formação básica, autoconhecimento e experiências supervisionadas de liderança. 
                      O desenvolvimento sistemático dessas competências será fundamental para sua evolução profissional.
                    </p>
                  );
                }
              })()}
            </div>
          </div>

          {/* Recomendações Profissionais */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Recomendações Profissionais</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Desenvolvimento Interpessoal
                  </h4>
                  <ul className="space-y-2 text-purple-700">
                    <li>• Participe de programas de coaching executivo</li>
                    <li>• Desenvolva habilidades de comunicação assertiva</li>
                    <li>• Pratique feedback construtivo e escuta ativa</li>
                    <li>• Invista em inteligência emocional aplicada</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Competências Estratégicas
                  </h4>
                  <ul className="space-y-2 text-green-700">
                    <li>• Desenvolva pensamento sistêmico e visão estratégica</li>
                    <li>• Aprimore habilidades de tomada de decisão</li>
                    <li>• Estude casos de liderança transformacional</li>
                    <li>• Pratique delegação eficaz e empoderamento</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Autodesenvolvimento
                  </h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Mantenha um diário de reflexão sobre liderança</li>
                    <li>• Busque mentoria com líderes experientes</li>
                    <li>• Participe de grupos de desenvolvimento de líderes</li>
                    <li>• Invista em autoconhecimento e autocrítica</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Aplicação Prática
                  </h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Lidere projetos desafiadores e multidisciplinares</li>
                    <li>• Implemente técnicas de gestão de mudanças</li>
                    <li>• Desenvolva e mentore outros líderes</li>
                    <li>• Meça e monitore o impacto de sua liderança</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Considerações sobre Gestão de Estresse Ocupacional */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Gestão de Estresse e Bem-Estar na Liderança</h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Estratégias Individuais</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    A liderança eficaz requer o gerenciamento adequado do próprio estresse e bem-estar. 
                    Baseando-se no modelo de Lazarus e Folkman, recomenda-se:
                  </p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Coping focado no problema:</strong> Identifique e aborde diretamente as fontes de estresse</li>
                    <li>• <strong>Coping focado na emoção:</strong> Desenvolva técnicas de regulação emocional</li>
                    <li>• <strong>Mindfulness aplicado:</strong> Pratique atenção plena nas decisões de liderança</li>
                    <li>• <strong>Equilíbrio vida-trabalho:</strong> Estabeleça limites saudáveis e tempo para recuperação</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Intervenções Organizacionais</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Como líder, você também é responsável por criar um ambiente que promova o bem-estar da equipe:
                  </p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>Clima psicológico seguro:</strong> Fomente abertura e confiança na equipe</li>
                    <li>• <strong>Recursos adequados:</strong> Garanta que a equipe tenha suporte necessário</li>
                    <li>• <strong>Reconhecimento sistemático:</strong> Implemente práticas regulares de feedback positivo</li>
                    <li>• <strong>Desenvolvimento contínuo:</strong> Ofereça oportunidades de crescimento e aprendizado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Referências Científicas */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Referências Científicas</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Bass, B. M., & Riggio, R. E. (2006). Transformational leadership. Psychology Press.</p>
              <p>• Goleman, D. (2000). Leadership that gets results. Harvard Business Review, 78(2), 78-90.</p>
              <p>• Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer Publishing Company.</p>
              <p>• Northouse, P. G. (2021). Leadership: Theory and practice. SAGE Publications.</p>
              <p>• Yukl, G. (2013). Leadership in organizations. Pearson Education.</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 print:bg-gray-100 rounded-lg p-6 mt-6 print:border print:border-gray-300">
          <h3 className="font-semibold text-blue-800 mb-2">Sobre o HumaniQ Lidera</h3>
          <p className="text-blue-700 text-sm">
            O HumaniQ Lidera avalia 8 dimensões fundamentais da liderança, fornecendo insights valiosos 
            sobre seu estilo de liderança e áreas de desenvolvimento. Use estes resultados para 
            aprimorar suas competências de liderança e maximizar seu potencial.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors print:hidden"
          >
            <Printer className="w-5 h-5" />
            <span>Imprimir Teste</span>
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('humaniq-lidera-answers');
              router.push('/colaborador/psicossociais/humaniq-lidera');
            }}
            className="flex items-center justify-center space-x-2 bg-purple-900 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors print:hidden"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Refazer Teste</span>
          </button>
          
          <button
            onClick={() => router.push('/colaborador/psicossociais')}
            className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors print:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar aos Testes</span>
          </button>
          
          <button
            onClick={() => router.push('/colaborador')}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors print:hidden"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}