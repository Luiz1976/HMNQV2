'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Heart,
  Users,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  CheckCircle,
  Star,
  Award,
  BarChart3,
  Zap,
  Globe,
  Clock,
  BookOpen,
  Smile,
  Building,
  Activity
} from 'lucide-react';

interface Dimension {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: string[];
}

interface InterpretationLevel {
  level: string;
  range: string;
  description: string;
  color: string;
}

interface Statistic {
  value: string;
  label: string;
}

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string[];
}

export default function HumaniqCobeIntroducao() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const dimensions: Dimension[] = [
    {
      id: 'bem-estar',
      title: 'Bem-Estar Psicologico',
      description: 'Avalia o nivel de satisfacao, engajamento e saude mental dos colaboradores',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      items: ['Satisfacao no trabalho', 'Equilibrio vida-trabalho', 'Saude mental', 'Motivacao intrinseca']
    },
    {
      id: 'clima',
      title: 'Clima Organizacional',
      description: 'Mede a percepcao do ambiente de trabalho e cultura organizacional',
      icon: Building,
      color: 'from-blue-500 to-cyan-500',
      items: ['Cultura organizacional', 'Ambiente de trabalho', 'Valores compartilhados', 'Identidade corporativa']
    },
    {
      id: 'relacionamentos',
      title: 'Relacionamentos Interpessoais',
      description: 'Analisa a qualidade das relacoes e comunicacao entre colaboradores',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      items: ['Comunicacao efetiva', 'Trabalho em equipe', 'Confianca mutua', 'Suporte social']
    },
    {
      id: 'desenvolvimento',
      title: 'Desenvolvimento Profissional',
      description: 'Avalia oportunidades de crescimento e aprendizado continuo',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
      items: ['Oportunidades de crescimento', 'Capacitacao', 'Feedback construtivo', 'Reconhecimento']
    }
  ];

  const interpretationLevels: InterpretationLevel[] = [
    {
      level: 'Critico',
      range: '1-2',
      description: 'Necessita intervencao imediata para melhorar o clima e bem-estar',
      color: 'bg-gradient-to-br from-red-500 to-red-600'
    },
    {
      level: 'Baixo',
      range: '2.1-3',
      description: 'Requer atencao e implementacao de melhorias significativas',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      level: 'Moderado',
      range: '3.1-4',
      description: 'Bom nivel com oportunidades de aprimoramento identificadas',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    },
    {
      level: 'Excelente',
      range: '4.1-5',
      description: 'Ambiente organizacional saudavel e bem-estar elevado',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    }
  ];

  const statistics: Statistic[] = [
    { value: '95%', label: 'Precisao' },
    { value: '50K+', label: 'Avaliacoes' },
    { value: '15min', label: 'Duracao' },
    { value: '4.9/5', label: 'Satisfacao' }
  ];

  const benefits: Benefit[] = [
    {
      icon: Heart,
      title: 'Bem-Estar Aprimorado',
      description: 'Identifica fatores que impactam a saude mental e satisfacao dos colaboradores'
    },
    {
      icon: Building,
      title: 'Clima Positivo',
      description: 'Avalia e melhora o ambiente organizacional para maior produtividade'
    },
    {
      icon: Users,
      title: 'Relacionamentos Saudaveis',
      description: 'Fortalece a comunicacao e colaboracao entre equipes'
    },
    {
      icon: TrendingUp,
      title: 'Desenvolvimento Continuo',
      description: 'Promove oportunidades de crescimento e aprendizado organizacional'
    },
    {
      icon: Shield,
      title: 'Prevencao de Burnout',
      description: 'Identifica sinais precoces de esgotamento e estresse organizacional'
    },
    {
      icon: Target,
      title: 'Metas Alinhadas',
      description: 'Garante que objetivos individuais estejam alinhados com os organizacionais'
    }
  ];

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Visao Geral do COBE',
      icon: Globe,
      content: [
        'O HumaniQ Pesquisa de Clima e uma ferramenta cientifica desenvolvida para avaliar o Clima Organizacional e Bem-Estar Psicologico no ambiente de trabalho.',
        'Baseado em pesquisas consolidadas em psicologia organizacional, o teste oferece insights profundos sobre a saude mental dos colaboradores e a qualidade do ambiente organizacional.',
        'Com 40 questoes cuidadosamente elaboradas, o COBE identifica areas de forca e oportunidades de melhoria para criar um ambiente de trabalho mais saudavel e produtivo.'
      ]
    },
    {
      id: 'science',
      title: 'Base Cientifica',
      icon: BookOpen,
      content: [
        'O teste fundamenta-se em teorias consolidadas como o Modelo de Bem-Estar de Ryff, a Teoria do Clima Organizacional de Litwin e Stringer, e pesquisas contemporaneas sobre saude mental no trabalho.',
        'Cada dimensao avaliada possui validacao empirica e correlacao com indicadores de performance organizacional, satisfacao no trabalho e retencao de talentos.',
        'A metodologia incorpora as melhores praticas em psicometria, garantindo confiabilidade e validade dos resultados obtidos.'
      ]
    },
    {
      id: 'applications',
      title: 'Aplicacoes Praticas',
      icon: Target,
      content: [
        'Diagnostico organizacional para identificar pontos de melhoria no clima e bem-estar dos colaboradores.',
        'Desenvolvimento de programas de qualidade de vida no trabalho e prevencao de burnout.',
        'Suporte na criacao de politicas de RH mais efetivas e alinhadas com as necessidades dos colaboradores.',
        'Monitoramento continuo da saude organizacional e acompanhamento de intervencoes implementadas.'
      ]
    }
  ];

  const handleBack = () => {
    router.push('/colaborador/psicossociais');
  };

  const handleStartTest = () => {
    setIsLoading(true);
    router.push('/colaborador/psicossociais/humaniq-cobe/teste');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [benefits.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % dimensions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [dimensions.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Clima & Bem-Estar
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              40 Questoes
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative px-6 py-20 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              HumaniQ 
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                COBE
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-purple-200 font-light mb-8">
              Clima Organizacional e Bem-Estar Psicologico
            </p>
            <p className="text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed">
              Avalie e transforme o ambiente organizacional da sua empresa. 
              Descubra insights profundos sobre bem-estar, clima organizacional e saude mental no trabalho.
            </p>
          </motion.div>

          {/* Central Brain Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="relative mb-16"
          >
            <div className="relative w-48 h-48 mx-auto">
              {/* Rotating rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-purple-400/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-indigo-400/40 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-2 border-pink-400/30 rounded-full"
              />
              
              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Benefits Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="relative px-6 py-20 bg-black/20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Beneficios do COBE
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Transforme sua organizacao com insights baseados em ciencia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="group"
              >
                <Card className={`bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group-hover:scale-105 ${
                  activeBenefit === index ? 'ring-2 ring-purple-400/50 bg-white/10' : ''
                }`}>
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={activeBenefit === index ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-indigo-500/30 transition-all duration-300"
                    >
                      <benefit.icon className="w-8 h-8 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-purple-200 leading-relaxed group-hover:text-purple-100 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Statistics Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative px-6 py-16 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-purple-200 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dimensions Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="relative px-6 py-20 bg-black/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Dimensoes Avaliadas
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Analise abrangente dos fatores que impactam o clima organizacional e bem-estar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {dimensions.map((dimension, index) => (
              <motion.div
                key={dimension.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                className="group"
              >
                <Card className={`bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group-hover:scale-105 ${
                  activeFeature === index ? 'ring-2 ring-purple-400/50 bg-white/10' : ''
                }`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <motion.div
                        animate={activeFeature === index ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${dimension.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <dimension.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                          {dimension.title}
                        </h3>
                        
                        <p className="text-purple-200 mb-4 leading-relaxed group-hover:text-purple-100 transition-colors duration-300">
                          {dimension.description}
                        </p>
                        
                        <div className="space-y-2">
                          {dimension.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detailed Information Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="relative px-6 py-20 bg-gradient-to-b from-black/40 to-black/60"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Conheca mais sobre a metodologia
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Conheca mais sobre a metodologia e aplicacoes do teste
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.0 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Navegacao</h3>
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <Button
                        key={section.id}
                        onClick={() => setCurrentSection(index)}
                        variant={currentSection === index ? "default" : "ghost"}
                        className={`w-full justify-start text-left transition-all duration-300 ${
                          currentSection === index 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                            : 'text-purple-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <section.icon className="w-4 h-4 mr-3" />
                        {section.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Display */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm min-h-[600px]">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl">
                          {React.createElement(sections[currentSection].icon, { 
                            className: "h-6 w-6 text-purple-300" 
                          })}
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {sections[currentSection].title}
                        </h3>
                      </div>
                      
                      <div className="prose prose-invert max-w-none">
                        <div className="text-purple-100 leading-relaxed space-y-4">
                          {sections[currentSection].content.map((paragraph, index) => (
                            <p key={index} className="text-purple-100">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Sistema de Pontuacao */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="relative px-6 py-20 bg-gradient-to-b from-black/40 to-black/60"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sistema de Pontuacao
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Interpretacao detalhada dos resultados e niveis de clima organizacional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interpretationLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${level.color} group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl font-bold text-white">
                        {level.range.split('-')[0]}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">
                      {level.level}
                    </h3>
                    
                    <div className="text-sm text-purple-300 mb-3">
                      {level.range}
                    </div>
                    
                    <p className="text-xs text-purple-200 leading-relaxed">
                      {level.description}
                    </p>
                    
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${level.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(index + 1) * 25}%` }}
                        transition={{ delay: 2.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Final CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="relative px-6 py-24 bg-gradient-to-b from-black/60 to-black/80 overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Pronto para Avaliar o
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> Clima da sua Organizacao</span>?
            </h2>
            
            <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Inicie sua avaliacao de clima organizacional e bem-estar psicologico com o HumaniQ Pesquisa de Clima. 
              Descubra oportunidades de melhoria em apenas alguns minutos.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.7, type: "spring", stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              onClick={handleStartTest}
              size="lg" 
              className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              <div className="relative flex items-center gap-3">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Iniciar Teste COBE
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </Button>
            
            <div className="text-center sm:text-left">
              <div className="text-sm text-purple-300 mb-1">Tempo estimado</div>
              <div className="text-lg font-semibold text-white">15-20 minutos</div>
            </div>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}