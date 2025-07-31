
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Building2, 
  Users, 
  TestTube, 
  Search, 
  Eye, 
  Filter,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Company {
  id: string
  name: string
  cnpj?: string
  industry?: string
  size: string
  subscriptionStatus: string
  subscriptionPlan: string
  employeeCount: number
  testCount: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: string
  owner?: {
    name: string
    email: string
  }
}

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'TRIAL': return 'bg-blue-100 text-blue-800'
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'HIGH': return 'text-orange-600'
      case 'CRITICAL': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <CheckCircle className="h-4 w-4" />
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4" />
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                         company.cnpj?.includes(search) ||
                         company.owner?.email.toLowerCase().includes(search.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'active') return matchesSearch && company.subscriptionStatus === 'ACTIVE'
    if (filter === 'trial') return matchesSearch && company.subscriptionStatus === 'TRIAL'
    if (filter === 'risk') return matchesSearch && ['HIGH', 'CRITICAL'].includes(company.riskLevel)
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão das Empresas</h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie todas as empresas cadastradas na plataforma
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Empresas</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Ativas</p>
                <p className="text-2xl font-bold text-green-900">
                  {companies.filter(c => c.subscriptionStatus === 'ACTIVE').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Em Trial</p>
                <p className="text-2xl font-bold text-blue-900">
                  {companies.filter(c => c.subscriptionStatus === 'TRIAL').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Alto Risco</p>
                <p className="text-2xl font-bold text-red-900">
                  {companies.filter(c => ['HIGH', 'CRITICAL'].includes(c.riskLevel)).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, CNPJ ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Ativas
          </Button>
          <Button
            variant={filter === 'trial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('trial')}
          >
            Trial
          </Button>
          <Button
            variant={filter === 'risk' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('risk')}
          >
            Alto Risco
          </Button>
        </div>
      </div>

      {/* Companies List */}
      <div className="grid gap-4">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
              </h3>
              <p className="text-gray-600">
                {search 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'As empresas aparecerão aqui após se cadastrarem'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <Badge className={getSubscriptionColor(company.subscriptionStatus)}>
                        {company.subscriptionStatus}
                      </Badge>
                      <Badge variant="outline">
                        {company.subscriptionPlan}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>CNPJ:</strong> {company.cnpj || 'Não informado'}</p>
                        <p><strong>Setor:</strong> {company.industry || 'Não informado'}</p>
                        <p><strong>Porte:</strong> {company.size}</p>
                      </div>
                      <div>
                        <p><strong>Responsável:</strong> {company.owner?.name}</p>
                        <p><strong>Email:</strong> {company.owner?.email}</p>
                        <p><strong>Cadastro:</strong> {new Date(company.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4" />
                          <span>{company.employeeCount} colaboradores</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <TestTube className="h-4 w-4" />
                          <span>{company.testCount} testes realizados</span>
                        </div>
                        <div className={`flex items-center gap-2 ${getRiskColor(company.riskLevel)}`}>
                          {getRiskIcon(company.riskLevel)}
                          <span>Risco {company.riskLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/admin/empresas/${company.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
