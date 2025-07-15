import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/collision_labs_logo.png'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Senhas não coincidem')
    }

    try {
      setError('')
      setLoading(true)
      await signup(formData.email, formData.password, formData.name)
      navigate('/')
    } catch (error) {
      setError('Falha ao criar conta')
    }
    
    setLoading(false)
  }

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={logo} alt="Collision Labs" className="h-12 mx-auto mb-4" />
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">Já tem conta? </span>
            <Link to="/login" className="text-primary hover:underline text-sm">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

