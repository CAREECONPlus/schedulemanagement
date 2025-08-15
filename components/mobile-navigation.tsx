"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
}

interface MobileNavigationProps {
  currentView: string
  onViewChange: (view: "calendar" | "form" | "staff" | "export") => void
  navigationItems: NavigationItem[]
}

export function MobileNavigation({ currentView, onViewChange, navigationItems }: MobileNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around px-1 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-14 px-2 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => onViewChange(item.id as any)}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-primary-foreground" : ""}`}>{item.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
