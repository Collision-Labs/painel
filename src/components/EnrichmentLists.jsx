import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
import { Plus, Upload, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useEnrichmentLists } from '../hooks/useEnrichmentLists'

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'Processando', color: 'bg-blue-500', icon: AlertCircle },
  completed: { label: 'Concluído', color: 'bg-green-500', icon: CheckCircle }
}

export default function EnrichmentLists() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companies: ''
  })
  const { lists, loading, addList, downloadResult } = useEnrichmentLists()

  async function handleSubmit(e) {
    e.preventDefault()
    
    const companiesArray = formData.companies
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(',').map(p => p.trim())
        return {
          name: parts[0] || '',
          cnpj: parts[1] || '',
          razaoSocial: parts[2] || ''
        }
      })

    await addList({
      name: formData.name,
      description: formData.description,
      companies: companiesArray,
      totalCompanies: companiesArray.length
    })

    setFormData({ name: '', description: '', companies: '' })
    setShowForm(false)
  }

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Listas para Enriquecimento</h2>
          <p className="text-muted-foreground">Gerencie suas solicitações de enriquecimento de dados</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Lista
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Lista para Enriquecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Lista</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="companies">Empresas (uma por linha: Nome, CNPJ, Razão Social)</Label>
                <Textarea
                  id="companies"
                  name="companies"
                  value={formData.companies}
                  onChange={handleChange}
                  placeholder="Exemplo:&#10;TechStart Inc, 12.345.678/0001-90, TechStart Tecnologia Ltda&#10;DevCorp, 98.765.432/0001-10, DevCorp Desenvolvimento"
                  rows={6}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">Criar Lista</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {lists.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Nenhuma lista encontrada. Crie sua primeira lista!
              </p>
            </CardContent>
          </Card>
        ) : (
          lists.map((list) => {
            const status = statusConfig[list.status] || statusConfig.pending
            const StatusIcon = status.icon
            
            return (
              <Card key={list.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{list.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {list.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Empresas</p>
                      <p className="text-lg font-semibold">{list.totalCompanies}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Criado em</p>
                      <p className="text-lg font-semibold">
                        {new Date(list.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {list.status === 'completed' && list.resultFileUrl && (
                    <Button 
                      onClick={() => downloadResult(list.id, list.resultFileUrl)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Resultado
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

