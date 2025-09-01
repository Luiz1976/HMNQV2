'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, BarChart3, TrendingUp, Users, Award } from 'lucide-react';

interface TestResult {
  dimensao: string;
  pontuacao: number;
  categoria: string;
}

const dimensoes = [
  'Liderança & Confiança',
  'Comunicação & Transparência', 
  'Reconhecimento & Recompensas',
  'Desenvolvimento & Crescimento',
  'Equilíbrio Vida-Trabalho',
  'Ambiente Físico & Recursos',
  'Colaboração & Trabalho em Equipe',
  'Inovação & Criatividade',
  'Diversidade & Inclusão',
  'Segurança Psicológica',
  'Propósito & Significado',
  'Autonomia & Empoderamento'
];

function getCategoria(pontuacao: number): string {
  if (pontuacao >= 80) return 'Excelente';
  if (pontuacao >= 60) return 'Bom';
  if (pontuacao >= 40) return 'Regular';
  return 'Necessita Atenção';
}

function getCorCategoria(categoria: string): string {
  switch (categoria) {
    case 'Excelente': return 'text-green-600 bg-green-50';
    case 'Bom': return 'text-blue-600 bg-blue-50';
    case 'Regular': return 'text-yellow-600 bg-yellow-50';
    case 'Necessita Atenção': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

// Função para calcular resultados reais baseados nas respostas
function calcularResultados(respostas: Record<number, number>): TestResult[] {
  // Mapeamento das questões por dimensão (5 questões cada)
  const dimensoesMapeamento = [
    { nome: 'Liderança & Confiança', questoes: [1, 2, 3, 4, 5] },
    { nome: 'Comunicação & Transparência', questoes: [6, 7, 8, 9, 10] },
    { nome: 'Reconhecimento & Recompensas', questoes: [11, 12, 13, 14, 15] },
    { nome: 'Desenvolvimento & Crescimento', questoes: [16, 17, 18, 19, 20] },
    { nome: 'Equilíbrio Vida-Trabalho', questoes: [21, 22, 23, 24, 25] },
    { nome: 'Ambiente Físico & Recursos', questoes: [26, 27, 28, 29, 30] },
    { nome: 'Colaboração & Trabalho em Equipe', questoes: [31, 32, 33, 34, 35] },
    { nome: 'Inovação & Criatividade', questoes: [36, 37, 38, 39, 40] },
    { nome: 'Diversidade & Inclusão', questoes: [41, 42, 43, 44, 45] },
    { nome: 'Segurança Psicológica', questoes: [46, 47, 48, 49, 50] },
    { nome: 'Propósito & Significado', questoes: [51, 52, 53, 54, 55] },
    { nome: 'Autonomia & Empoderamento', questoes: [56, 57, 58, 59, 60] }
  ];
  
  return dimensoesMapeamento.map(dimensao => {
    // Calcular média das 5 questões da dimensão
    const somaRespostas = dimensao.questoes.reduce((soma, questaoId) => {
      return soma + (respostas[questaoId] || 0);
    }, 0);
    
    const media = somaRespostas / dimensao.questoes.length;
    
    // Converter escala 1-5 para 0-100
    const pontuacao = Math.round(((media - 1) / 4) * 100);
    
    return {
      dimensao: dimensao.nome,
      pontuacao: Math.max(0, Math.min(100, pontuacao)), // Garantir que fique entre 0-100
      categoria: getCategoria(pontuacao)
    };
  });
}

export default function ResultadoPage() {
  const router = useRouter();
  const [resultados, setResultados] = useState<TestResult[]>([]);
  const [indiceGlobal, setIndiceGlobal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarResultados = () => {
      try {
        // Recuperar respostas do localStorage
        const respostasString = localStorage.getItem('humaniq-clima-respostas');
        const respostas = respostasString ? JSON.parse(respostasString) : {};
        
        // Verificar se há respostas suficientes
        const totalRespostas = Object.keys(respostas).length;
        if (totalRespostas < 60) {
          // Se não há respostas suficientes, gerar dados simulados para demonstração
          const resultadosSimulados: TestResult[] = dimensoes.map(dimensao => {
            const pontuacao = Math.floor(Math.random() * 40) + 40;
            return {
              dimensao,
              pontuacao,
              categoria: getCategoria(pontuacao)
            };
          });
          
          const indice = Math.round(resultadosSimulados.reduce((acc, r) => acc + r.pontuacao, 0) / resultadosSimulados.length);
          
          setResultados(resultadosSimulados);
          setIndiceGlobal(indice);
          setLoading(false);
          return;
        }
        
        // Calcular resultados reais baseados nas respostas
        const resultadosReais = calcularResultados(respostas);
        setResultados(resultadosReais);
        
        // Calcular Índice Global (média das 12 dimensões)
        const indiceGlobal = Math.round(
          resultadosReais.reduce((acc, r) => acc + r.pontuacao, 0) / resultadosReais.length
        );
        setIndiceGlobal(indiceGlobal);
        
      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
        // Em caso de erro, usar dados simulados
        const resultadosSimulados: TestResult[] = dimensoes.map(dimensao => {
          const pontuacao = Math.floor(Math.random() * 40) + 40;
          return {
            dimensao,
            pontuacao,
            categoria: getCategoria(pontuacao)
          };
        });
        
        const indice = Math.round(resultadosSimulados.reduce((acc, r) => acc + r.pontuacao, 0) / resultadosSimulados.length);
        
        setResultados(resultadosSimulados);
        setIndiceGlobal(indice);
      }
      
      setLoading(false);
    };

    setTimeout(carregarResultados, 1000);
  }, []);

  const handleVoltar = () => {
    router.push('/colaborador/corporativo/humaniq-pesquisa-clima');
  };

  const handleBaixarRelatorio = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando seus resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">HumaniQ CLIMA</h1>
              <p className="text-purple-100 mt-1">Pesquisa de Clima Organizacional</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{indiceGlobal}</div>
              <div className="text-sm text-purple-100">Índice Global</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Resumo Geral */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Resumo dos Resultados</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {resultados.filter(r => r.categoria === 'Excelente').length}
              </div>
              <div className="text-sm text-green-700">Excelente</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {resultados.filter(r => r.categoria === 'Bom').length}
              </div>
              <div className="text-sm text-blue-700">Bom</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {resultados.filter(r => r.categoria === 'Regular').length}
              </div>
              <div className="text-sm text-yellow-700">Regular</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {resultados.filter(r => r.categoria === 'Necessita Atenção').length}
              </div>
              <div className="text-sm text-red-700">Necessita Atenção</div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Interpretação do Índice Global</h3>
            <p className="text-purple-700 text-sm">
              Seu índice global de <strong>{indiceGlobal}</strong> indica um clima organizacional{' '}
              <strong>{getCategoria(indiceGlobal).toLowerCase()}</strong>. 
              {indiceGlobal >= 80 && 'Parabéns! Sua organização apresenta um excelente clima organizacional.'}
              {indiceGlobal >= 60 && indiceGlobal < 80 && 'Sua organização tem um bom clima, com oportunidades de melhoria.'}
              {indiceGlobal >= 40 && indiceGlobal < 60 && 'Há aspectos importantes que precisam de atenção para melhorar o clima.'}
              {indiceGlobal < 40 && 'É recomendado focar em melhorias significativas no ambiente organizacional.'}
            </p>
          </div>
        </div>

        {/* Resultados por Dimensão */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Resultados por Dimensão</h2>
          </div>
          
          <div className="space-y-4">
            {resultados.map((resultado, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{resultado.dimensao}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-700">{resultado.pontuacao}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCorCategoria(resultado.categoria)}`}>
                      {resultado.categoria}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${resultado.pontuacao}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Próximos Passos</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-gray-700">Compartilhe estes resultados com sua liderança para discussão de melhorias</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-gray-700">Foque nas dimensões que necessitam de maior atenção</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <p className="text-gray-700">Acompanhe o progresso através de pesquisas periódicas</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleVoltar}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Início
          </button>
          
          <button
            onClick={handleBaixarRelatorio}
            className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar Relatório Completo
          </button>
        </div>
      </div>
    </div>
  );
}