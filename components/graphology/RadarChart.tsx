'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface ChartDataItem {
  name: string
  value: number
}

interface RadarChartData {
  subject: string
  score: number
  fullMark: number
}

interface GraphologyRadarChartProps {
  data: ChartDataItem[]
}

export default function GraphologyRadarChart({ data: chartData }: GraphologyRadarChartProps) {
  const data: RadarChartData[] = chartData.map(item => ({
    subject: item.name,
    score: item.value,
    fullMark: 100,
  }))

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Perfil de Competências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid gridType="polygon" className="stroke-gray-200" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                className="text-gray-600"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickCount={6}
              />
              <Radar
                name="Pontuação"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 4, fill: '#3B82F6' }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  color: '#6B7280'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Score Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item, index) => {
            const getScoreColor = (score: number) => {
              if (score >= 80) return 'text-green-600 bg-green-50'
              if (score >= 60) return 'text-blue-600 bg-blue-50'
              if (score >= 40) return 'text-yellow-600 bg-yellow-50'
              return 'text-red-600 bg-red-50'
            }
            
            return (
              <div key={index} className={`p-3 rounded-lg ${getScoreColor(item.score).split(' ')[1]}`}>
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {item.subject}
                </div>
                <div className={`text-lg font-bold ${getScoreColor(item.score).split(' ')[0]}`}>
                  {item.score}%
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}