import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Search, Plus, Filter, Loader2 } from 'lucide-react'
import { useLeads } from '../hooks/useLeads'

const statusColors = {
  hot: 'bg-red-500',
  warm: 'bg-yellow-500', 
  cold: 'bg-blue-500'
}

export default function LeadsManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const { leads, loading, error, addLead } = useLeads()

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddLead = async () => {
    try {
      await addLead({
        name: 'Novo Lead',
        email: 'contato@exemplo.com',
        status: 'cold',
        segment: 'Startup'
      })
    } catch (err) {
      console.error('Erro ao adicionar lead:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Erro ao carregar leads: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestão de Leads</h2>
          <p className="text-muted-foreground">Gerencie e qualifique seus leads</p>
        </div>
        <Button onClick={handleAddLead} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum lead encontrado
              </p>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${statusColors[lead.status] || statusColors.cold}`} />
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{lead.segment}</Badge>
                    <Badge className={statusColors[lead.status] || statusColors.cold}>{lead.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

