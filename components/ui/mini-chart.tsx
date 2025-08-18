'use client'

import { PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

interface MiniChartProps {
  type: 'radar' | 'pie' | 'bar' | 'gauge'
  data: any[]
  color?: string
}

export function MiniChart({ type, data, color = 'blue' }: MiniChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-400">Sem dados</p>
        </div>
      </div>
    )
  }

  const getColorPalette = (colorName: string) => {
    const palettes = {
      blue: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        light: '#DBEAFE',
        gradient: ['#3B82F6', '#60A5FA', '#93C5FD']
      },
      green: {
        primary: '#10B981',
        secondary: '#34D399',
        light: '#D1FAE5',
        gradient: ['#10B981', '#34D399', '#6EE7B7']
      },
      purple: {
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        light: '#EDE9FE',
        gradient: ['#8B5CF6', '#A78BFA', '#C4B5FD']
      },
      orange: {
        primary: '#F59E0B',
        secondary: '#FBBF24',
        light: '#FEF3C7',
        gradient: ['#F59E0B', '#FBBF24', '#FCD34D']
      },
      red: {
        primary: '#EF4444',
        secondary: '#F87171',
        light: '#FEE2E2',
        gradient: ['#EF4444', '#F87171', '#FCA5A5']
      },
      gray: {
        primary: '#6B7280',
        secondary: '#9CA3AF',
        light: '#F3F4F6',
        gradient: ['#6B7280', '#9CA3AF', '#D1D5DB']
      }
    }
    return palettes[colorName as keyof typeof palettes] || palettes.blue
  }

  const colorPalette = getColorPalette(color)

  switch (type) {
    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <PolarGrid stroke={colorPalette.light} />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fontSize: 9, fill: '#6B7280' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 8, fill: '#9CA3AF' }}
              domain={[0, 100]}
              tickCount={3}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={colorPalette.primary}
              fill={colorPalette.primary}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      )

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={15}
              outerRadius={45}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorPalette.gradient[index % colorPalette.gradient.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 15, left: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 8, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 8, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Bar 
              dataKey="value" 
              fill={colorPalette.primary}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )

    case 'gauge':
      // Implementação de gauge usando semicírculo
      const score = data[0]?.value || 0
      const gaugeData = [
        { name: 'Score', value: score, fill: colorPalette.primary },
        { name: 'Remaining', value: 100 - score, fill: colorPalette.light }
      ]
      
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                dataKey="value"
                cx="50%"
                cy="70%"
                startAngle={180}
                endAngle={0}
                innerRadius={25}
                outerRadius={45}
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-2 text-center">
            <div className={`text-lg font-bold`} style={{ color: colorPalette.primary }}>
              {score.toFixed(0)}%
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 bg-red-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400">Tipo não suportado</p>
          </div>
        </div>
      )
  }
}