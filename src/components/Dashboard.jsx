import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Users, Mail, TrendingUp, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const metrics = [
  {
    title: 'Total de Leads',
    value: '2,847',
    change: '+12%',
    icon: Users,
    color: 'text-chart-1'
  },
  {
    title: 'Emails Enviados',
    value: '18,432',
    change: '+8%',
    icon: Mail,
    color: 'text-chart-2'
  },
  {
    title: 'Taxa de Conversão',
    value: '24.5%',
    change: '+3%',
    icon: TrendingUp,
    color: 'text-chart-3'
  },
  {
    title: 'Receita Gerada',
    value: 'R$ 89.2K',
    change: '+15%',
    icon: DollarSign,
    color: 'text-chart-4'
  }
]

const chartData = [
  { name: 'Jan', leads: 400, emails: 2400 },
  { name: 'Fev', leads: 300, emails: 1398 },
  { name: 'Mar', leads: 200, emails: 9800 },
  { name: 'Abr', leads: 278, emails: 3908 },
  { name: 'Mai', leads: 189, emails: 4800 },
  { name: 'Jun', leads: 239, emails: 3800 }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral da sua operação de outbound</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{metric.change}</span> desde o mês passado
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Performance Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Bar dataKey="leads" fill="hsl(var(--chart-1))" />
              <Bar dataKey="emails" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

