import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, CreditCard, User, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { useCredits } from '../hooks/useCredits'

function AddCreditsForm({ user, onSave, onCancel }) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || parseInt(amount) <= 0) return
    
    onSave({
      userId: user.id,
      amount: parseInt(amount),
      reason: reason || 'Créditos adicionados pelo admin'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Usuário</Label>
        <div className="p-2 bg-muted rounded">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm">Créditos atuais: {user.credits || 0}</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="amount">Quantidade de Créditos</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ex: 10"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="reason">Motivo (opcional)</Label>
        <Input
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: Pacote mensal, bônus, etc."
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit">Adicionar Créditos</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

function CreditHistoryCard({ transaction }) {
  const isPositive = transaction.amount > 0
  
  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{transaction.userName}</span>
              <Badge variant="outline">{transaction.userEmail}</Badge>
            </div>
            
            <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(transaction.createdAt?.toDate()).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {isPositive ? '+' : ''}{transaction.amount} créditos
                </span>
              </div>
            </div>
            
            {transaction.reason && (
              <p className="mt-1 text-sm text-muted-foreground">
                {transaction.reason}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Saldo após</div>
            <div className="font-medium">{transaction.balanceAfter} créditos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CreditsManager() {
  const { 
    users, 
    transactions, 
    loading, 
    addCredits, 
    getUserTransactions 
  } = useCredits()
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterUser, setFilterUser] = useState('all')

  const handleAddCredits = async (creditData) => {
    try {
      await addCredits(creditData)
      setShowAddForm(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Erro ao adicionar créditos:', error)
    }
  }

  const filteredTransactions = filterUser === 'all' 
    ? transactions 
    : transactions.filter(t => t.userId === filterUser)

  const totalCreditsDistributed = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalCreditsUsed = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gerenciar Créditos</h2>
          <p className="text-muted-foreground">Adicione e monitore créditos dos usuários</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Créditos Distribuídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCreditsDistributed.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Créditos Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCreditsUsed.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + (user.credits || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários e Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={user.credits > 0 ? "default" : "secondary"}>
                    {user.credits || 0} créditos
                  </Badge>
                  
                  <Dialog open={showAddForm && selectedUser?.id === user.id} onOpenChange={setShowAddForm}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Créditos</DialogTitle>
                      </DialogHeader>
                      <AddCreditsForm
                        user={user}
                        onSave={handleAddCredits}
                        onCancel={() => {
                          setShowAddForm(false)
                          setSelectedUser(null)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Transações */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Histórico de Transações</CardTitle>
            
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma transação encontrada
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <CreditHistoryCard 
                  key={transaction.id} 
                  transaction={transaction} 
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

