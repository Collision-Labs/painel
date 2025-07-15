import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, Edit, Trash2, Building2, User, Phone, Mail, Calendar, DollarSign } from 'lucide-react'
import { useCRM } from '../hooks/useCRM'

const pipelineStages = [
  { id: 'proposal_sent', name: 'Proposta Enviada', color: 'bg-blue-500' },
  { id: 'negotiation', name: 'Negociação', color: 'bg-yellow-500' },
  { id: 'won', name: 'Negócio Ganho', color: 'bg-green-500' },
  { id: 'lost', name: 'Negócio Perdido', color: 'bg-red-500' }
]

function DealCard({ deal, onEdit, onDelete, onMove }) {
  const [showNotes, setShowNotes] = useState(false)
  
  const stage = pipelineStages.find(s => s.id === deal.stage)
  
  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">{deal.company}</CardTitle>
            <p className="text-xs text-muted-foreground">{deal.contactName}</p>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(deal)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(deal.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3" />
            <span>R$ {deal.value?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {deal.notes && (
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs p-0 h-auto"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? 'Ocultar' : 'Ver'} observações
            </Button>
            {showNotes && (
              <p className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded">
                {deal.notes}
              </p>
            )}
          </div>
        )}
        
        <div className="mt-2 flex space-x-1">
          {pipelineStages.map(stageOption => (
            <Button
              key={stageOption.id}
              variant={deal.stage === stageOption.id ? "default" : "outline"}
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => onMove(deal.id, stageOption.id)}
            >
              {stageOption.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DealForm({ deal, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: deal?.company || '',
    contactName: deal?.contactName || '',
    contactEmail: deal?.contactEmail || '',
    contactPhone: deal?.contactPhone || '',
    value: deal?.value || '',
    expectedCloseDate: deal?.expectedCloseDate || '',
    stage: deal?.stage || 'proposal_sent',
    notes: deal?.notes || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...deal,
      ...formData,
      value: parseFloat(formData.value) || 0
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactName">Nome do Contato</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Telefone</Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="value">Valor (R$)</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="expectedCloseDate">Data Prevista</Label>
          <Input
            id="expectedCloseDate"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="stage">Estágio</Label>
        <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pipelineStages.map(stage => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Adicione observações sobre esta negociação..."
          rows={3}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit">Salvar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default function CRM() {
  const { deals, loading, addDeal, updateDeal, deleteDeal, moveDeal } = useCRM()
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleSaveDeal = async (dealData) => {
    try {
      if (dealData.id) {
        await updateDeal(dealData.id, dealData)
      } else {
        await addDeal(dealData)
      }
      setShowForm(false)
      setSelectedDeal(null)
    } catch (error) {
      console.error('Erro ao salvar negócio:', error)
    }
  }

  const handleDeleteDeal = async (dealId) => {
    if (confirm('Tem certeza que deseja excluir este negócio?')) {
      try {
        await deleteDeal(dealId)
      } catch (error) {
        console.error('Erro ao excluir negócio:', error)
      }
    }
  }

  const handleMoveDeal = async (dealId, newStage) => {
    try {
      await moveDeal(dealId, newStage)
    } catch (error) {
      console.error('Erro ao mover negócio:', error)
    }
  }

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const getTotalValue = (stageId) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">CRM - Pipeline de Vendas</h2>
          <p className="text-muted-foreground">Gerencie seus negócios e oportunidades</p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedDeal(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Negócio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDeal ? 'Editar Negócio' : 'Novo Negócio'}
              </DialogTitle>
            </DialogHeader>
            <DealForm
              deal={selectedDeal}
              onSave={handleSaveDeal}
              onCancel={() => {
                setShowForm(false)
                setSelectedDeal(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-4 gap-6">
        {pipelineStages.map(stage => (
          <div key={stage.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-semibold">{stage.name}</h3>
              </div>
              <Badge variant="secondary">
                {getDealsByStage(stage.id).length}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Total: R$ {getTotalValue(stage.id).toLocaleString()}
            </div>
            
            <div className="space-y-2 min-h-[400px] bg-muted/20 rounded-lg p-3">
              {getDealsByStage(stage.id).map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onEdit={(deal) => {
                    setSelectedDeal(deal)
                    setShowForm(true)
                  }}
                  onDelete={handleDeleteDeal}
                  onMove={handleMoveDeal}
                />
              ))}
              
              {getDealsByStage(stage.id).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum negócio neste estágio
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Negócios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Total Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {deals.reduce((sum, deal) => sum + (deal.value || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Negócios Ganhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getDealsByStage('won').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.length > 0 ? Math.round((getDealsByStage('won').length / deals.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

