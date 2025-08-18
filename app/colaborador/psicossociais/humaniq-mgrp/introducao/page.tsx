'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Clock, FileText, Shield, TrendingUp, Users, MessageSquare, CheckCircle, AlertTriangle, Target, BookOpen, BarChart3 } from 'lucide-react';

export default function HumaniqMGRPIntroduction() {
  const router = useRouter();

  const dimensions = [
    {
      name: "Prevenção e Mapeamento",
      icon: Shield,
      description: "Avaliação e identificação proativa dos riscos psicossociais",
      color: "text-blue-600"
    },
    {
      name: "Monitoramento e Controle",
      icon: TrendingUp,
      description: "Sistemas de acompanhamento contínuo dos indicadores",
      color: "text-green-600"
    },
    {
      name: "Acolhimento e Suporte",
      icon: Users,
      description: "Programas de apoio e assistência aos colaboradores",
      color: "text-purple-600"
    },
    {
      name: "Conformidade Legal",
      icon: FileText,
      description: "Cumprimento das normas e regulamentações vigentes",
      color: "text-orange-600"
    },
    {
      name: "Cultura e Comunicação",
      icon: MessageSquare,
      description: "Ambiente organizacional e práticas de comunicação",
      color: "text-red-600"
    }
  ];

  const maturityLevels = [
    { level: "Excelente", range: "4.5 - 5.0", color: "bg-green-100 text-green-800", description: "Gestão exemplar de riscos psicossociais" },
    { level: "Boa", range: "3.5 - 4.4", color: "bg-blue-100 text-blue-800", description: "Gestão adequada com oportunidades de melhoria" },
    { level: "Regular", range: "2.5 - 3.4", color: "bg-yellow-100 text-yellow-800", description: "Gestão básica, necessita melhorias significativas" },
    { level: "Insuficiente", range: "1.5 - 2.4", color: "bg-orange-100 text-orange-800", description: "Gestão inadequada, requer ação imediata" },
    { level: "Crítica", range: "1.0 - 1.4", color: "bg-red-100 text-red-800", description: "Ausência de gestão, risco elevado" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/colaborador/psicossociais')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">HumaniQ MGRP</h1>
            </div>
            <p className="text-blue-200">Teste de Maturidade em Gestão de Riscos Psicossociais</p>
          </div>
          <div className="w-16" />
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Avalie a maturidade da sua organização na gestão de riscos psicossociais</h2>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto">
            Diagnóstico abrangente sobre práticas, processos e sistemas implementados para prevenir, monitorar e controlar fatores que impactam a saúde mental
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">40</div>
            <div className="text-blue-200 text-sm">Questões</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">5</div>
            <div className="text-blue-200 text-sm">Dimensões</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-blue-200 text-sm">Precisão</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">15 min</div>
            <div className="text-blue-200 text-sm">Duração</div>
          </div>
        </div>

        {/* Colored Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-green-500 rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">15-20 min</div>
            <div className="text-sm opacity-90">90% precisão</div>
          </div>
          <div className="bg-blue-500 rounded-xl p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">4+ a 0,85</div>
            <div className="text-sm opacity-90">100+ estudos</div>
          </div>
          <div className="bg-purple-500 rounded-xl p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">Escala 1-5</div>
            <div className="text-sm opacity-90">Likert</div>
          </div>
          <div className="bg-orange-500 rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3" />
            <div className="font-semibold mb-1">IGM</div>
            <div className="text-sm opacity-90">Índice Geral</div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Dimensões Avaliadas</h3>
          <p className="text-center text-blue-200 mb-8 max-w-3xl mx-auto">
            Análise multidimensional das capacidades organizacionais para identificação, prevenção e controle de riscos psicossociais
          </p>
          
          <div className="grid gap-4">
            {dimensions.map((dimension, index) => {
              const Icon = dimension.icon;
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 ${colors[index]} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{dimension.name}</h4>
                    <p className="text-blue-200 text-sm">{dimension.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scientific Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold">Base Científica</h3>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold mb-1">NR 01 - Norma Regulamentadora</h4>
                <p className="text-sm text-blue-200">Disposições Gerais e Gerenciamento de Riscos Ocupacionais</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold mb-1">ISO 45003</h4>
                <p className="text-sm text-blue-200">Diretrizes para gestão de saúde e segurança psicológica no trabalho</p>
              </div>
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold mb-1">OIT - Organização Internacional do Trabalho</h4>
                <p className="text-sm text-blue-200">Convenções e recomendações sobre riscos psicossociais</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <h3 className="text-xl font-bold">Validação Científica</h3>
            </div>
            <div className="space-y-4">
              <p className="text-blue-200 text-sm leading-relaxed">
                O HumaniQ MGRP foi desenvolvido com base em frameworks internacionais de gestão de riscos psicossociais, 
                incorporando as melhores práticas de organizações de referência mundial.
              </p>
              <p className="text-blue-200 text-sm leading-relaxed">
                Baseado em décadas de pesquisa em psicologia organizacional e 500+ organizações avaliadas, 
                oferece uma metodologia robusta e confiável para diagnóstico organizacional.
              </p>
            </div>
          </div>
        </div>

        {/* Circle with Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/colaborador/psicossociais/humaniq-mgrp')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Iniciar Avaliação
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}