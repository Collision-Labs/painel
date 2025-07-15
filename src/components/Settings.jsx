import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações da plataforma</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtp-server">Servidor SMTP</Label>
              <Input id="smtp-server" placeholder="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtp-port">Porta</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            <div>
              <Label htmlFor="email-user">Usuário</Label>
              <Input id="email-user" placeholder="seu@email.com" />
            </div>
            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Firebase</h3>
                <p className="text-sm text-muted-foreground">Banco de dados e autenticação</p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">API Externa</h3>
                <p className="text-sm text-muted-foreground">Enriquecimento de dados</p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

