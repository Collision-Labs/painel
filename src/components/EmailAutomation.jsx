import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Play, Pause, Plus, Loader2 } from 'lucide-react'
import { useCampaigns } from '../hooks/useCampaigns'

export default function EmailAutomation() {
  const { campaigns, loading, error, addCampaign, updateCampaign } = useCampaigns()

  const handleAddCampaign = async () => {
    try {
      await addCampaign({
        name: 'Nova Campanha',
        subject: 'Assunto do email',
        template: 'Template padrão'
      })
    } catch (err) {
      console.error('Erro ao criar campanha:', err)
    }
  }

  const toggleCampaignStatus = async (campaign) => {
    try {
      const newStatus = campaign.status === 'active' ? 'paused' : 'active'
      await updateCampaign(campaign.id, { status: newStatus })
    } catch (err) {
      console.error('Erro ao atualizar campanha:', err)
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
        Erro ao carregar campanhas: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Automação de Email</h2>
          <p className="text-muted-foreground">Gerencie suas campanhas de email</p>
        </div>
        <Button onClick={handleAddCampaign} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Nenhuma campanha encontrada. Crie sua primeira campanha!
              </p>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{campaign.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleCampaignStatus(campaign)}
                    >
                      {campaign.status === 'active' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Emails Enviados</p>
                    <p className="text-2xl font-bold">{campaign.sent || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Abertura</p>
                    <p className="text-2xl font-bold">
                      {campaign.sent > 0 ? Math.round(((campaign.opened || 0) / campaign.sent) * 100) : 0}%
                    </p>
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

