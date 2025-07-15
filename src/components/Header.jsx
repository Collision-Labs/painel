import { Menu, Bell, User } from 'lucide-react'
import { Button } from './ui/button'

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="text-foreground hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Collision Platform
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

