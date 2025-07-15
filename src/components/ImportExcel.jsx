import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Building2
} from 'lucide-react'
import { useImportExcel } from '../hooks/useImportExcel'

function PreviewTable({ data, onConfirm, onCancel }) {
  const [selectedRows, setSelectedRows] = useState(new Set())
  
  const toggleRow = (index) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }
  
  const toggleAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map((_, index) => index)))
    }
  }
  
  const handleConfirm = () => {
    const selectedData = data.filter((_, index) => selectedRows.has(index))
    onConfirm(selectedData)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Preview dos Dados</h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={toggleAll}>
            {selectedRows.size === data.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </Button>
          <Button onClick={handleConfirm} disabled={selectedRows.size === 0}>
            Importar {selectedRows.size} leads
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-auto">
          <table className="w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-2 text-left">Empresa</th>
                <th className="p-2 text-left">Contato</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Telefone</th>
                <th className="p-2 text-left">CNPJ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr 
                  key={index} 
                  className={`border-t ${selectedRows.has(index) ? 'bg-blue-50' : ''}`}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => toggleRow(index)}
                    />
                  </td>
                  <td className="p-2 font-medium">{row.empresa || row.company || '-'}</td>
                  <td className="p-2">{row.contato || row.name || '-'}</td>
                  <td className="p-2">{row.email || '-'}</td>
                  <td className="p-2">{row.telefone || row.phone || '-'}</td>
                  <td className="p-2">{row.cnpj || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ImportHistory({ imports }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Importações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {imports.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhuma importação realizada ainda
            </div>
          ) : (
            imports.map(importRecord => (
              <div key={importRecord.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{importRecord.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {importRecord.totalRecords} leads importados
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(importRecord.createdAt?.toDate()).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={importRecord.status === 'completed' ? 'default' : 'secondary'}>
                    {importRecord.status === 'completed' ? 'Concluído' : 'Processando'}
                  </Badge>
                  
                  {importRecord.status === 'completed' && (
                    <Badge variant="outline">
                      {importRecord.successCount} sucessos
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ImportExcel() {
  const { 
    importHistory, 
    loading, 
    parseExcelFile, 
    importLeadsToCRM 
  } = useImportExcel()
  
  const [dragActive, setDragActive] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      alert('Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV (.csv)')
      return
    }

    try {
      const data = await parseExcelFile(file)
      setPreviewData(data)
    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
      alert('Erro ao processar arquivo. Verifique se o formato está correto.')
    }
  }

  const handleConfirmImport = async (selectedData) => {
    setImporting(true)
    setImportProgress(0)
    
    try {
      const result = await importLeadsToCRM(selectedData, (progress) => {
        setImportProgress(progress)
      })
      
      setImportResult(result)
      setPreviewData(null)
    } catch (error) {
      console.error('Erro na importação:', error)
      alert('Erro durante a importação. Tente novamente.')
    } finally {
      setImporting(false)
      setImportProgress(0)
    }
  }

  const downloadTemplate = () => {
    const template = [
      ['empresa', 'contato', 'email', 'telefone', 'cnpj'],
      ['Exemplo Empresa Ltda', 'João Silva', 'joao@exemplo.com', '(11) 99999-9999', '12.345.678/0001-90'],
      ['Outra Empresa S.A.', 'Maria Santos', 'maria@outra.com', '(11) 88888-8888', '98.765.432/0001-10']
    ]
    
    const csvContent = template.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_importacao_leads.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Importar Leads do Excel</h2>
          <p className="text-muted-foreground">
            Importe leads enriquecidos diretamente para o CRM
          </p>
        </div>
        
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Baixar Template
        </Button>
      </div>

      {/* Resultado da Importação */}
      {importResult && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Importação concluída! {importResult.successCount} leads importados com sucesso.
            {importResult.errorCount > 0 && ` ${importResult.errorCount} erros encontrados.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Preview dos Dados */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Importação</CardTitle>
          </CardHeader>
          <CardContent>
            <PreviewTable
              data={previewData}
              onConfirm={handleConfirmImport}
              onCancel={() => setPreviewData(null)}
            />
          </CardContent>
        </Card>
      )}

      {/* Progress da Importação */}
      {importing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importando leads...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      {!previewData && !importing && (
        <Card>
          <CardHeader>
            <CardTitle>Upload do Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Arraste seu arquivo Excel aqui
              </h3>
              <p className="text-muted-foreground mb-4">
                Ou clique para selecionar um arquivo (.xlsx, .xls, .csv)
              </p>
              
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </Label>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">Formato esperado:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Coluna "empresa" ou "company" - Nome da empresa</li>
                <li>Coluna "contato" ou "name" - Nome do contato</li>
                <li>Coluna "email" - Email do contato</li>
                <li>Coluna "telefone" ou "phone" - Telefone</li>
                <li>Coluna "cnpj" - CNPJ da empresa (opcional)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      <ImportHistory imports={importHistory} />
    </div>
  )
}

