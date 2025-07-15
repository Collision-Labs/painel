import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Upload, Download, Eye, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { useAdminLists } from '../hooks/useAdminLists'

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'Processando', color: 'bg-blue-500', icon: AlertCircle },
  completed: { label: 'Concluído', color: 'bg-green-500', icon: CheckCircle }
}

export default function AdminPanel() {
  const [selectedList, setSelectedList] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [notes, setNotes] = useState('')
  const { lists, loading, updateStatus, uploadResult } = useAdminLists()

  async function handleStatusUpdate(listId, newStatus) {
    await updateStatus(listId, newStatus, notes)
    setNotes('')
  }

  async function handleFileUpload(listId) {
    if (!uploadFile) return
    
    await uploadResult(listId, uploadFile, notes)
    setUploadFile(null)
    setNotes('')
    setSelectedList(null)
  }

  function viewCompanies(list) {
    setSelectedList(list)
  }

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Painel Administrativo</h2>
        <p className="text-muted-foreground">Gerencie solicitações de enriquecimento</p>
      </div>

      {selectedList && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes: {selectedList.name}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedList(null)}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Empresas ({selectedList.totalCompanies})</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedList.companies?.map((company, index) => (
                    <div key={index} className="p-2 border rounded text-sm">
                      <div><strong>Nome:</strong> {company.name}</div>
                      {company.cnpj && <div><strong>CNPJ:</strong> {company.cnpj}</div>}
                      {company.razaoSocial && <div><strong>Razão Social:</strong> {company.razaoSocial}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas/Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre o processamento..."
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleStatusUpdate(selectedList.id, 'processing')}
                  disabled={selectedList.status === 'processing'}
                >
                  Marcar como Processando
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                  <Button 
                    onClick={() => handleFileUpload(selectedList.id)}
                    disabled={!uploadFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Resultado
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {lists.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Nenhuma solicitação encontrada
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
                        Cliente: {list.userName || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {list.description}
                      </p>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Empresas</p>
                      <p className="text-lg font-semibold">{list.totalCompanies}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Criado em</p>
                      <p className="text-sm">
                        {new Date(list.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Atualizado</p>
                      <p className="text-sm">
                        {new Date(list.updatedAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewCompanies(list)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    
                    {list.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(list.id, 'processing')}
                      >
                        Iniciar Processamento
                      </Button>
                    )}
                    
                    {list.resultFileUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(list.resultFileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Ver Resultado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

