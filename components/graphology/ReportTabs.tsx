'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Eye, 
  Brain, 
  FileText, 
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export type TabType = 'dashboard' | 'visualization' | 'manuscript' | 'insights'

interface Tab {
  id: TabType
  label: string
  icon: React.ReactNode
  description: string
  badge?: string
}

interface ReportTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  className?: string
}

const tabs: Tab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Visão geral dos resultados',
    badge: 'Resumo'
  },
  {
    id: 'visualization',
    label: 'Visualização',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Gráficos e métricas detalhadas',
    badge: 'Dados'
  },
  {
    id: 'manuscript',
    label: 'Manuscrito',
    icon: <Eye className="h-4 w-4" />,
    description: 'Análise visual do manuscrito',
    badge: 'Visual'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: <Brain className="h-4 w-4" />,
    description: 'Interpretações profissionais',
    badge: 'Análise'
  }
]

export default function ReportTabs({ activeTab, onTabChange, className }: ReportTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null)

  return (
    <Card className={cn("border-0 bg-white/80 backdrop-blur-sm", className)}>
      <CardContent className="p-6">
        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const isHovered = hoveredTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  animate={{
                    scale: isActive ? 1.05 : 1
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </motion.div>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-md shadow-sm border border-blue-100"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg text-xs font-medium transition-all duration-200 min-w-[80px]",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? [0, -5, 5, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {tab.icon}
                  </motion.div>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className="text-xs px-1 py-0"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Tab Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-2">
              <div className="text-blue-600">
                {tabs.find(tab => tab.id === activeTab)?.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-xs text-blue-700">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progresso da Análise</span>
            <span>4/4 Seções</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Comparar
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Award className="h-3 w-3 mr-1" />
            Certificar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Export tab configuration for use in other components
export { tabs, type Tab }