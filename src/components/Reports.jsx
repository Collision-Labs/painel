import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', conversao: 20, leads: 400 },
  { name: 'Fev', conversao: 25, leads: 300 },
  { name: 'Mar', conversao: 30, leads: 500 },
  { name: 'Abr', conversao: 28, leads: 450 },
  { name: 'Mai', conversao: 35, leads: 600 },
  { name: 'Jun', conversao: 32, leads: 550 }
]

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Relatórios</h2>
        <p className="text-muted-foreground">Análise de performance e métricas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="conversao" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="leads" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

