"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, X, Search } from "lucide-react"

export interface FiltrosSimples {
  area: string
  periodo: string
  busca: string
}

interface FiltrosProps {
  filtros: FiltrosSimples
  onFiltrosChange: (filtros: FiltrosSimples) => void
  onLimparFiltros: () => void
}

export function FiltrosSimples({ filtros, onFiltrosChange, onLimparFiltros }: FiltrosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const areas = [
    { value: "todos", label: "Todas as Áreas" },
    { value: "rh", label: "Recursos Humanos" },
    { value: "ti", label: "Tecnologia" },
    { value: "vendas", label: "Vendas" },
    { value: "marketing", label: "Marketing" },
    { value: "financeiro", label: "Financeiro" },
    { value: "operacoes", label: "Operações" }
  ]

  const periodos = [
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 90 dias" },
    { value: "6m", label: "Últimos 6 meses" },
    { value: "1a", label: "Último ano" }
  ]

  const handleAreaChange = (value: string) => {
    onFiltrosChange({ ...filtros, area: value })
  }

  const handlePeriodoChange = (value: string) => {
    onFiltrosChange({ ...filtros, periodo: value })
  }

  const handleBuscaChange = (value: string) => {
    onFiltrosChange({ ...filtros, busca: value })
  }

  const filtrosAtivos = [
    filtros.area !== "todos" && areas.find(a => a.value === filtros.area)?.label,
    filtros.periodo !== "30d" && periodos.find(p => p.value === filtros.periodo)?.label,
    filtros.busca && `Busca: "${filtros.busca}"`
  ].filter(Boolean)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <div className="flex items-center gap-2">
            {filtrosAtivos.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filtrosAtivos.length} filtro{filtrosAtivos.length > 1 ? 's' : ''} ativo{filtrosAtivos.length > 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {mostrarFiltros && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Área */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Área</label>
              <Select value={filtros.area} onValueChange={handleAreaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Período */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={filtros.periodo} onValueChange={handlePeriodoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((periodo) => (
                    <SelectItem key={periodo.value} value={periodo.value}>
                      {periodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campo de Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por palavra-chave..."
                  value={filtros.busca}
                  onChange={(e) => handleBuscaChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Filtros Ativos */}
          {filtrosAtivos.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {filtrosAtivos.map((filtro, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {filtro}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLimparFiltros}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar todos
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}