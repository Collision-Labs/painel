import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/collision_labs_logo.png'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      setMessage('')
      setError('')
      setLoading(true)
      await resetPassword(email)
      setMessage('Verifique seu email para redefinir a senha')
    } catch (error) {
      setError('Falha ao enviar email de redefinição')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="Collision Labs" className="h-12 mx-auto mb-4" />
          <CardTitle>Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded mb-4">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Email'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Link to="/login" className="text-primary hover:underline text-sm">
              Voltar ao login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

