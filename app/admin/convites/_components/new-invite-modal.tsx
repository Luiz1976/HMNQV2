'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface NewInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInviteCreated: (inviteData?: any) => void
}

export function NewInviteModal({ open, onOpenChange, onInviteCreated }: NewInviteModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    message: ''
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.companyName) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/invites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Convite criado com sucesso!')
        onInviteCreated(data)
        onOpenChange(false)
        resetForm()
      } else {
        toast.error(data.error?.message || 'Erro ao criar convite')
      }
    } catch (error) {
      toast.error('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      companyName: '',
      message: ''
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Novo Convite
          </DialogTitle>
          <DialogDescription>
            Crie um novo convite para uma empresa.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Empresa *</Label>
              <Input
                id="companyName"
                placeholder="Nome da empresa"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Mensagem personalizada para o convite..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Convite'
                )}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  )
}