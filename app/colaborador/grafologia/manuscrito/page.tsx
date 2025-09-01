'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Brain, Target, Users, TrendingUp, Eye, Lightbulb, CheckCircle, Star, Sparkles, Zap } from 'lucide-react'

export default function ManuscritoIntroPage() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const typingTexts = [
    'Análise Grafológica Avançada',
    'Tecnologia de IA Aplicada',
    'Resultados Científicos Precisos'
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const currentText = typingTexts[currentTextIndex]
    let currentIndex = 0
    setTypedText('')

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setTypedText(currentText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [currentTextIndex])

  const handleGoBack = () => {
    router.push('/colaborador/grafologia')
  }

  const handleStartAnalysis = () => {
    router.push('/colaborador/grafologia/manuscrito/upload')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
      {/* Animated Comet */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="comet-container">
          <div className="comet">
            <div className="comet-head"></div>
            <div className="comet-tail"></div>
          </div>
        </div>
      </div>

      {/* Advanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 3 === 0 ? 'w-2 h-2 bg-blue-400/10' :
              i % 3 === 1 ? 'w-1 h-1 bg-gray-400/20' :
              'w-3 h-3 bg-purple-400/5'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
            }}
          />
        ))}
      </div>

      {/* Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-gray-500/10 to-blue-500/10 rounded-full blur-2xl"
          style={{
            transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.03}px)`,
            right: '15%',
            top: '60%'
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with Advanced Effects */}
          <div className="flex items-center mb-12 transform transition-all duration-1000" style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}>
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="mr-6 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <div className="bg-gray-700/50 p-3 rounded-xl backdrop-blur-sm border border-gray-600/30 hover:scale-110 hover:rotate-3 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 group relative">
                <Brain className="h-8 w-8 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Análise de Manuscrito
                </h1>
                <p className="text-gray-300 text-lg hover:text-gray-200 transition-colors duration-300">
                  Descubra sua personalidade através da sua escrita
                </p>
              </div>
            </div>
          </div>

          {/* Hero Section with Advanced Effects */}
          <div ref={heroRef} className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-600/30 hover:bg-gray-800/90 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 group relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            
            <div className="text-center max-w-4xl mx-auto relative z-10">
              {/* Animated icon container */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-700/50 p-4 rounded-full transform transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-2xl hover:shadow-purple-500/20 group-hover:bg-gradient-to-r group-hover:from-blue-600/20 group-hover:to-purple-600/20 relative overflow-hidden">
                  <FileText className="h-12 w-12 text-gray-300 relative z-10 group-hover:animate-pulse group-hover:text-blue-400 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Sparkle effects */}
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping" />
                  <Zap className="absolute -bottom-2 -left-2 h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 animate-bounce" />
                </div>
              </div>
              
              {/* Typing animation title */}
              <h2 className="text-3xl font-bold text-white mb-4 min-h-[3rem] relative">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {typedText}
                </span>
                <span className="animate-pulse text-blue-400">|</span>
              </h2>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6 transform transition-all duration-700 hover:text-gray-200 hover:scale-105">
                A grafologia é uma ciência que estuda a personalidade através da análise da escrita manuscrita. 
                Nosso sistema utiliza inteligência artificial para identificar padrões únicos em sua caligrafia 
                e revelar aspectos profundos de sua personalidade.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-gray-600/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    <Brain className="h-8 w-8 text-gray-300 hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">IA Avançada</h3>
                  <p className="text-gray-400 text-sm">Algoritmos de última geração</p>
                </div>
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-gray-600/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <Target className="h-8 w-8 text-gray-300 hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Precisão</h3>
                  <p className="text-gray-400 text-sm">Análise detalhada e precisa</p>
                </div>
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                  <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-gray-600/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                    <Eye className="h-8 w-8 text-gray-300 hover:text-green-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Insights</h3>
                  <p className="text-gray-400 text-sm">Revelações sobre sua personalidade</p>
                </div>
              </div>
              
              {/* Floating elements inside hero */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Target className="h-8 w-8 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <Brain className="h-6 w-6 text-purple-400 animate-bounce" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          {/* Scientific Foundation */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-700 transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/20 group relative overflow-hidden">
              {/* Ripple effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-white flex items-center gap-3 group-hover:text-blue-100 transition-colors duration-300">
                  <div className="relative">
                    <Lightbulb className="h-6 w-6 text-gray-300 group-hover:text-yellow-400 transition-all duration-300 group-hover:animate-pulse" />
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </div>
                  Fundamentação Científica
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4 relative z-10">
                <p className="leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  A grafologia baseia-se em décadas de pesquisa científica que demonstram 
                  a conexão entre os movimentos da escrita e os processos neurológicos 
                  que refletem traços de personalidade.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 transform transition-all duration-300 hover:translate-x-2">
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-green-400 transition-colors duration-300" />
                    <span className="text-sm group-hover:text-gray-200 transition-colors duration-300">Baseada em estudos neuropsicológicos</span>
                  </div>
                  <div className="flex items-start gap-3 transform transition-all duration-300 hover:translate-x-2">
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-green-400 transition-colors duration-300" />
                    <span className="text-sm group-hover:text-gray-200 transition-colors duration-300">Validada por pesquisas acadêmicas</span>
                  </div>
                  <div className="flex items-start gap-3 transform transition-all duration-300 hover:translate-x-2">
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-green-400 transition-colors duration-300" />
                    <span className="text-sm group-hover:text-gray-200 transition-colors duration-300">Utilizada em seleção de pessoal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-700 transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/20 group relative overflow-hidden">
              {/* Ripple effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-white flex items-center gap-3 group-hover:text-purple-100 transition-colors duration-300">
                  <div className="relative">
                    <Users className="h-6 w-6 text-gray-300 group-hover:text-purple-400 transition-all duration-300 group-hover:animate-pulse" />
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </div>
                  12 Dimensões Comportamentais
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 relative z-10">
                <p className="mb-4 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Nossa análise avalia 12 dimensões fundamentais da personalidade:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    'Liderança', 'Comunicação', 'Criatividade', 'Organização',
                    'Sociabilidade', 'Determinação', 'Flexibilidade', 'Autoconfiança',
                    'Empatia', 'Persistência', 'Inovação', 'Estabilidade'
                  ].map((dimension, index) => (
                    <div key={dimension} className="flex items-center gap-2 transform transition-all duration-300 hover:translate-x-1 hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
                      <Star className="h-3 w-3 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                      <span className="group-hover:text-gray-200 transition-colors duration-300">{dimension}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-600/30 hover:bg-gray-800/70 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 group relative overflow-hidden">
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h2 className="text-2xl font-bold text-white mb-8 text-center relative z-10 group-hover:text-cyan-100 transition-colors duration-300">
              Como Funciona a Análise
            </h2>
            <div className="grid md:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  step: '1',
                  title: 'Upload',
                  description: 'Envie uma foto da sua escrita manuscrita',
                  color: 'blue'
                },
                {
                  step: '2', 
                  title: 'Análise',
                  description: 'IA processa características da escrita',
                  color: 'purple'
                },
                {
                  step: '3',
                  title: 'Avaliação', 
                  description: 'Mapeamento das 12 dimensões',
                  color: 'green'
                },
                {
                  step: '4',
                  title: 'Resultado', 
                  description: 'Relatório detalhado da personalidade',
                  color: 'orange'
                }
              ].map((item, index) => (
                <div key={item.step} className="text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-2" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className={`bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-${item.color}-500/30 transition-all duration-300 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-2xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">{item.step}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-100 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm mb-12 hover:bg-gray-800/70 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 group relative overflow-hidden">
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-3 group-hover:text-emerald-100 transition-colors duration-300">
                <div className="relative">
                  <TrendingUp className="h-6 w-6 text-gray-300 group-hover:text-emerald-400 transition-all duration-300 group-hover:animate-pulse" />
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                </div>
                Benefícios e Aplicações
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                <div className="transform transition-all duration-500 hover:translate-x-2">
                  <h4 className="text-white font-semibold mb-3 group-hover:text-emerald-100 transition-colors duration-300">Desenvolvimento Pessoal</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Autoconhecimento profundo',
                      'Identificação de pontos fortes', 
                      'Áreas de melhoria'
                    ].map((benefit, index) => (
                      <li key={benefit} className="flex items-start gap-2 transform transition-all duration-300 hover:translate-x-1" style={{ animationDelay: `${index * 100}ms` }}>
                        <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-emerald-400 transition-colors duration-300" />
                        <span className="group-hover:text-gray-200 transition-colors duration-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="transform transition-all duration-500 hover:translate-x-2">
                  <h4 className="text-white font-semibold mb-3 group-hover:text-emerald-100 transition-colors duration-300">Aplicações Profissionais</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Seleção de pessoal',
                      'Desenvolvimento de equipes',
                      'Coaching e mentoria'
                    ].map((application, index) => (
                      <li key={application} className="flex items-start gap-2 transform transition-all duration-300 hover:translate-x-1" style={{ animationDelay: `${index * 100}ms` }}>
                        <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-emerald-400 transition-colors duration-300" />
                        <span className="group-hover:text-gray-200 transition-colors duration-300">{application}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30">
              <h2 className="text-2xl font-bold text-white mb-4">
                Pronto para Descobrir sua Personalidade?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Inicie sua jornada de autoconhecimento através da análise grafológica. 
                O processo é rápido, seguro e revelador.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="border-white/80 text-white bg-gray-800/50 hover:bg-white hover:text-gray-900 hover:border-white transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-white/30 relative overflow-hidden group"
                >
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ArrowLeft className="h-4 w-4 mr-2 relative z-10 group-hover:animate-bounce" />
                  <span className="relative z-10">Voltar aos Testes</span>
                </Button>
                <Button
                  onClick={handleStartAnalysis}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-110 hover:-translate-y-1 relative overflow-hidden group"
                >
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <FileText className="h-5 w-5 mr-2 relative z-10 group-hover:animate-pulse" />
                  <span className="relative z-10">Iniciar Análise</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <style jsx>{`

        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .comet-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: cometMove 25s linear infinite;
        }

        .comet {
          position: absolute;
          top: 10%;
          left: -5%;
          width: 200px;
          height: 8px;
          transform: rotate(-25deg);
        }

        .comet-head {
          position: absolute;
          right: 0;
          top: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #a855f7 30%, #3b82f6 70%, transparent 100%);
          box-shadow: 
            0 0 10px #ffffff,
            0 0 20px #a855f7,
            0 0 30px #3b82f6;
          animation: cometGlow 2s ease-in-out infinite alternate;
        }

        .comet-tail {
          position: absolute;
          right: 8px;
          top: 2px;
          width: 180px;
          height: 4px;
          background: linear-gradient(
            to left,
            rgba(168, 85, 247, 0.8) 0%,
            rgba(59, 130, 246, 0.6) 20%,
            rgba(147, 51, 234, 0.4) 40%,
            rgba(79, 70, 229, 0.2) 60%,
            rgba(99, 102, 241, 0.1) 80%,
            transparent 100%
          );
          border-radius: 2px;
          filter: blur(1px);
        }

        @keyframes cometMove {
          0% {
            transform: translate(-10%, 10%) rotate(0deg);
          }
          100% {
            transform: translate(110%, -10%) rotate(0deg);
          }
        }

        @keyframes cometGlow {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}