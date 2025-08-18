'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

interface BarChartData {
  name: string
  score: number
  description: string
  color: string
}

interface GraphologyBarChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <p className="text-lg font-bold text-blue-600 mb-2">{data.score}%</p>
        <p className="text-sm text-gray-600">{data.description}</p>
      </div>
    )
  }
  return null
}

export default function GraphologyBarChart({ data: chartData }: GraphologyBarChartProps) {
  const getDescription = (name: string) => {
    const descriptions: { [key: string]: string } = {
      'Comunicação': 'Capacidade de expressar ideias de forma clara e eficaz',
      'Organização': 'Habilidade para estruturar e planejar atividades',
      'Estabilidade Emocional': 'Controle emocional e resiliência em situações desafiadoras',
      'Liderança': 'Capacidade de influenciar e guiar outras pessoas',
      'Adaptabilidade': 'Flexibilidade para se ajustar a mudanças e novos contextos'
    }
    return descriptions[name] || 'Análise detalhada da competência'
  }

  const data: BarChartData[] = chartData.map((item, index) => {
    const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6']
    return {
      name: item.name,
      score: item.value,
      description: getDescription(item.name),
      color: colors[index % colors.length]
    }
  })

  const getBarColor = (score: number) => {
    if (score >= 80) return '#10B981' // green
    if (score >= 60) return '#3B82F6' // blue
    if (score >= 40) return '#F59E0B' // yellow
    return '#EF4444' // red
  }

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Análise Detalhada de Competências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                label={{ value: 'Pontuação (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => {
            const getIndicatorStyle = (score: number) => {
              if (score >= 80) return 'border-green-200 bg-green-50'
              if (score >= 60) return 'border-blue-200 bg-blue-50'
              if (score >= 40) return 'border-yellow-200 bg-yellow-50'
              return 'border-red-200 bg-red-50'
            }

            const getScoreTextColor = (score: number) => {
              if (score >= 80) return 'text-green-700'
              if (score >= 60) return 'text-blue-700'
              if (score >= 40) return 'text-yellow-700'
              return 'text-red-700'
            }

            return (
              <div key={index} className={`p-4 rounded-lg border-2 ${getIndicatorStyle(item.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                  <span className={`text-xl font-bold ${getScoreTextColor(item.score)}`}>
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getBarColor(item.score) === '#10B981' ? 'bg-green-500' : 
                      getBarColor(item.score) === '#3B82F6' ? 'bg-blue-500' :
                      getBarColor(item.score) === '#F59E0B' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 leading-tight">{item.description}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}