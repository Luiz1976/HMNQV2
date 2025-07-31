'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Bell, 
  Shield, 
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ConfiguracoesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Estados para configurações da empresa
  const [companyData, setCompanyData] = useState({
    name: 'Empresa Exemplo Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresa.com',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123 - São Paulo, SP',
    description: 'Empresa focada em inovação e desenvolvimento de soluções tecnológicas.',
    website: 'https://www.empresa.com'
  })
  
  // Estados para configurações de notificações
  const [notifications, setNotifications] = useState({
    emailReports: true,
    testReminders: true,
    riskAlerts: true,
    weeklyDigest: false,
    systemUpdates: true
  })
  
  // Estados para configurações de privacidade
  const [privacy, setPrivacy] = useState({
    dataRetention: '24', // meses
    anonymizeData: true,
    shareAnalytics: false,
    allowExport: true
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações da Empresa</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as configurações e preferências da sua empresa
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Building2 className="h-4 w-4 mr-1" />
          Módulo Empresa
        </Badge>
      </div>

      {/* Alert de sucesso */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configurações salvas com sucesso!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Informações da Empresa</span>
            </CardTitle>
            <CardDescription>
              Dados básicos e informações de contato da empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                value={companyData.name}
                onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={companyData.cnpj}
                onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={companyData.address}
                onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                value={companyData.description}
                onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              <span>Notificações</span>
            </CardTitle>
            <CardDescription>
              Configure como e quando receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios por E-mail</Label>
                <p className="text-sm text-gray-500">Receber relatórios semanais por e-mail</p>
              </div>
              <Switch
                checked={notifications.emailReports}
                onCheckedChange={(checked) => setNotifications({...notifications, emailReports: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes de Testes</Label>
                <p className="text-sm text-gray-500">Notificar sobre testes pendentes</p>
              </div>
              <Switch
                checked={notifications.testReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, testReminders: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Risco</Label>
                <p className="text-sm text-gray-500">Notificações imediatas para riscos altos</p>
              </div>
              <Switch
                checked={notifications.riskAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, riskAlerts: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumo Semanal</Label>
                <p className="text-sm text-gray-500">Digest semanal com estatísticas</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Atualizações do Sistema</Label>
                <p className="text-sm text-gray-500">Notificações sobre novas funcionalidades</p>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Privacidade e Segurança</span>
            </CardTitle>
            <CardDescription>
              Configurações de privacidade e retenção de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Retenção de Dados (meses)</Label>
              <Input
                id="retention"
                type="number"
                min="12"
                max="60"
                value={privacy.dataRetention}
                onChange={(e) => setPrivacy({...privacy, dataRetention: e.target.value})}
              />
              <p className="text-xs text-gray-500">Tempo para manter dados dos testes (12-60 meses)</p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Anonimizar Dados</Label>
                <p className="text-sm text-gray-500">Remover identificadores pessoais dos relatórios</p>
              </div>
              <Switch
                checked={privacy.anonymizeData}
                onCheckedChange={(checked) => setPrivacy({...privacy, anonymizeData: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compartilhar Analytics</Label>
                <p className="text-sm text-gray-500">Permitir uso de dados para melhorias do sistema</p>
              </div>
              <Switch
                checked={privacy.shareAnalytics}
                onCheckedChange={(checked) => setPrivacy({...privacy, shareAnalytics: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Exportação</Label>
                <p className="text-sm text-gray-500">Usuários podem exportar seus próprios dados</p>
              </div>
              <Switch
                checked={privacy.allowExport}
                onCheckedChange={(checked) => setPrivacy({...privacy, allowExport: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Estatísticas</span>
            </CardTitle>
            <CardDescription>
              Resumo dos dados da empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Colaboradores</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600">Testes Completos</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">23</div>
                <div className="text-sm text-gray-600">Candidatos Ativos</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-sm text-gray-600">Integrações ERP</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Dica:</strong> Mantenha suas configurações atualizadas para garantir 
                o melhor funcionamento do sistema e conformidade com regulamentações.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  )
}