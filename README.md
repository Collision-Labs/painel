# Collision Platform - Outbound Marketing

Plataforma completa para gestão de leads e automação de outbound marketing da Collision Labs.

## 🚀 Funcionalidades

### Dashboard
- Métricas em tempo real (leads, emails, conversões, receita)
- Gráficos de performance mensal
- Visão geral da operação

### Gestão de Leads
- Importação e exportação de listas
- Segmentação por critérios
- Status de qualificação (hot, warm, cold)
- Busca e filtros avançados

### Automação de Email
- Criação de campanhas
- Templates personalizáveis
- Sequências automatizadas
- Métricas de abertura e cliques

### CRM Integrado
- Pipeline de vendas
- Gestão de oportunidades
- Histórico de interações
- Relatórios de performance

### Relatórios
- Análise de conversão
- Performance de campanhas
- Métricas detalhadas

## 🛠️ Tecnologias

- **Frontend**: React.js + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Banco de dados**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Configure o Firebase:
   - Atualize as configurações em `src/lib/firebase.js`
   - Adicione suas credenciais do Firebase

4. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   ```

## 🔧 Configuração do Firebase

Para configurar o Firebase corretamente:

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Vá em Project Settings > General > Your apps
3. Copie as configurações do Firebase SDK
4. Substitua as configurações em `src/lib/firebase.js`

Exemplo de configuração:
```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "collisionlabs-cb323.firebaseapp.com",
  projectId: "collisionlabs-cb323",
  storageBucket: "collisionlabs-cb323.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
}
```

## 🚀 Deploy

Para fazer deploy da aplicação:

1. Build da aplicação:
   ```bash
   pnpm run build
   ```

2. O build será gerado na pasta `dist/`

3. Faça upload dos arquivos para seu servidor ou use serviços como:
   - Vercel
   - Netlify
   - Firebase Hosting

## 📱 Responsividade

A plataforma é totalmente responsiva e funciona em:
- Desktop
- Tablet
- Mobile

## 🎨 Design

- Layout preto e roxo seguindo a identidade da Collision Labs
- Interface moderna e intuitiva
- Componentes reutilizáveis
- Animações suaves

## 📊 Estrutura de Dados

### Leads
```javascript
{
  id: string,
  name: string,
  email: string,
  status: 'hot' | 'warm' | 'cold',
  segment: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Campanhas
```javascript
{
  id: string,
  name: string,
  subject: string,
  template: string,
  status: 'draft' | 'active' | 'paused',
  sent: number,
  opened: number,
  clicked: number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Segurança

- Autenticação via Firebase Auth
- Regras de segurança no Firestore
- Validação de dados no frontend
- HTTPS obrigatório em produção

## 📞 Suporte

Para suporte técnico, entre em contato:
- Email: contato@collisionlabs.com.br
- Telefone: (16) 99642-1486

---

Desenvolvido com ❤️ para Collision Labs

