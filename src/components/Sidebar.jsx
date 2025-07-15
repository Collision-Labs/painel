import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  Settings,
  List,
  Shield,
  LogOut,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/collision_labs_logo.png'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'CRM', href: '/crm', icon: Building2 },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Enriquecimento', href: '/enrichment', icon: List },
  { name: 'Importar Excel', href: '/import', icon: FileSpreadsheet },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings }
]

export default function Sidebar({ isOpen }) {
  const location = useLocation()
  const { userProfile, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    } flex flex-col`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Collision Labs" className="h-8 w-8" />
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold">Painel</h1>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          )
        })}
        
        {userProfile?.role === 'collision_admin' && (
          <>
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Shield className="h-5 w-5" />
              {isOpen && <span>Admin</span>}
            </Link>
            
            <Link
              to="/credits"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/credits'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              {isOpen && <span>Créditos</span>}
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        {isOpen && userProfile && (
          <div className="mb-3">
            <p className="text-sm font-medium">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground">
              {userProfile.role === 'collision_admin' ? 'Collision Admin' : 'Cliente'}
            </p>
            {userProfile.credits !== undefined && (
              <p className="text-xs text-primary font-medium">
                {userProfile.credits} créditos
              </p>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size={isOpen ? "default" : "icon"}
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          {isOpen && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  )
}

