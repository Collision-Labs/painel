import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/collision_labs_logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/')
    } catch (error) {
      setError('Falha no login. Verifique suas credenciais.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="Collision Labs" className="h-12 mx-auto mb-4" />
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
              {error}
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
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            <Link to="/reset-password" className="text-primary hover:underline text-sm">
              Esqueceu a senha?
            </Link>
            <div>
              <span className="text-sm text-muted-foreground">Não tem conta? </span>
              <Link to="/signup" className="text-primary hover:underline text-sm">
                Cadastre-se
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

