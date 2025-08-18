import React from 'react';
import { Crown, User, Calendar, TrendingUp } from 'lucide-react';

interface GraphologyReportHeaderProps {
  userName: string;
  testDate: string;

  testType: string;
}

export function GraphologyReportHeader({
  userName,
  testDate,

  testType
}: GraphologyReportHeaderProps) {


  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-purple-100 shadow-lg">
      {/* Frase Inspiradora */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Análise Grafológica Profissional
        </h1>
        <p className="text-lg text-gray-700 font-medium italic max-w-2xl mx-auto leading-relaxed">
          "Sua escrita revela quem você é. Veja o que sua mente expressa além das palavras."
        </p>
      </div>

      {/* Informações do Teste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações do Usuário */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Colaborador</p>
              <p className="text-lg font-semibold text-gray-800">{userName}</p>
            </div>
          </div>
        </div>

        {/* Data do Teste */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Data da Análise</p>
              <p className="text-lg font-semibold text-gray-800">{testDate}</p>
            </div>
          </div>
        </div>

        {/* Confiança da Análise */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Status da IA</p>
              <p className="text-lg font-semibold text-green-600">
                Completa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}