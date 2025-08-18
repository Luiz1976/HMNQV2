
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Copy, Check, CheckCircle } from 'lucide-react'
import { NewInviteModal } from './_components/new-invite-modal'
import { toast } from 'sonner'

// Define the type for a single invitation based on the API response
interface Invitation {
  id: string
  email: string
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'
  createdAt: string
  expiresAt: string
  company: {
    name: string
  }
  inviter: {
    firstName: string | null
    lastName: string | null
  } | null
}

export default function ConvitesPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewInviteModal, setShowNewInviteModal] = useState(false)
  const [lastCreatedInvite, setLastCreatedInvite] = useState<{token: string, email: string, companyName: string} | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchInvitations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/invites')
      if (!response.ok) {
        throw new Error('Falha ao buscar convites')
      }
      const data = await response.json()
      // A API retorna um array direto, não um objeto com propriedade invitations
      setInvitations(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Link copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  const handleInviteCreated = (inviteData?: any) => {
    if (inviteData && inviteData.token) {
      setLastCreatedInvite({
        token: inviteData.token,
        email: inviteData.email,
        companyName: inviteData.company?.name || 'N/A'
      })
    }
    fetchInvitations()
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const getStatusVariant = (status: Invitation['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return 'default' // Using 'default' as a stand-in for 'success'
      case 'PENDING':
      case 'SENT':
        return 'default'
      case 'EXPIRED':
        return 'destructive'
      case 'CANCELLED':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Convites</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os convites do sistema.
          </p>
        </div>
        <Button onClick={() => setShowNewInviteModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Convite
        </Button>
      </div>

      {lastCreatedInvite && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Convite Gerado com Sucesso!
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  <p>Configuração: {lastCreatedInvite.companyName} | 0 teste(s) | Aplicação única</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Link do Convite</label>
                  <div className="flex gap-2">
                    <input
                       type="text"
                       value={typeof window !== 'undefined' ? `${window.location.origin}/invite/${lastCreatedInvite.token}` : `/invite/${lastCreatedInvite.token}`}
                       readOnly
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white font-mono text-sm"
                     />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/invite/${lastCreatedInvite.token}` : `/invite/${lastCreatedInvite.token}`)}
                      className={copied ? 'bg-green-50 border-green-200' : ''}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-500"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setLastCreatedInvite(null)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Gerar Novo Convite
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Convites Enviados</CardTitle>
          <CardDescription>
            A lista completa de convites para empresas e candidatos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Expira em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>{invite.company.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invite.status)}>
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewInviteModal
        open={showNewInviteModal}
        onOpenChange={setShowNewInviteModal}
        onInviteCreated={handleInviteCreated}
      />
    </div>
  )
}
