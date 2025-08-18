'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Calendar,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CandidatosPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [selectedCandidato, setSelectedCandidato] = useState<string | null>(null)

  // Mock data - em produção, estes dados viriam da API
  const candidatos: any[] = []



  const positions = [...new Set(candidatos.map(c => c.position))]

  const filteredCandidatos = candidatos.filter(candidato => {
    const matchesSearch = candidato.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidato.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || candidato.status === statusFilter
    const matchesPosition = positionFilter === 'all' || candidato.position === positionFilter
    
    return matchesSearch && matchesStatus && matchesPosition
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'inactive': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'pending': return 'Pendente'
      case 'inactive': return 'Inativo'
      default: return 'Status Desconhecido'
    }
  }



  if (selectedCandidato) {
    const candidato = candidatos.find(c => c.id === selectedCandidato)
    
    return (
      <div className="space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedCandidato(null)}>
            ← Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{candidato?.name}</h1>
            <p className="text-gray-600">{candidato?.position} - {candidato?.experience} de experiência</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {candidato?.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {candidato?.phone}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Aplicou em {new Date(candidato?.appliedDate || '').toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Candidato */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Candidato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{candidato?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium">{candidato?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cargo Pretendido</p>
                <p className="font-medium">{candidato?.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experiência</p>
                <p className="font-medium">{candidato?.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fonte</p>
                <p className="font-medium">{candidato?.source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={getStatusColor(candidato?.status || '')}>
                  {getStatusIcon(candidato?.status || '')}
                  <span className="ml-1">{getStatusText(candidato?.status || '')}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Candidatos</h1>
          <p className="text-gray-600">
            Gerencie candidatos e avalie adequação psicossocial para as vagas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cargos</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Candidatos */}
      <div className="grid gap-4">
        {filteredCandidatos.map((candidato) => (
          <Card 
            key={candidato.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCandidato(candidato.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidato.avatar} />
                    <AvatarFallback>
                      {candidato.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{candidato.name}</h3>
                    <p className="text-sm text-gray-600">{candidato.position}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{candidato.experience} de experiência</span>
                      <span>•</span>
                      <span>Fonte: {candidato.source}</span>
                      <span>•</span>
                      <span>Aplicou em {new Date(candidato.appliedDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(candidato.status)}>
                    {getStatusIcon(candidato.status)}
                    <span className="ml-1">{getStatusText(candidato.status)}</span>
                  </Badge>
                </div>
              </div>
              

            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidatos.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum candidato encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}