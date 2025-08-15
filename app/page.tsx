"use client"

import { useState } from "react"
import { Calendar } from "@/components/calendar-view"
import { ProjectForm } from "@/components/project-form"
import { StaffManagement } from "@/components/staff-management"
import { DataExport } from "@/components/data-export"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, Users, Menu, Download } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"calendar" | "form" | "staff" | "export">("calendar")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: "calendar", label: "カレンダー", icon: CalendarIcon },
    { id: "form", label: "新規登録", icon: Plus },
    { id: "staff", label: "担当者", icon: Users },
    { id: "export", label: "データ出力", icon: Download },
  ]

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Desktop/Tablet Header */}
      <header className="bg-white border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">案件・スケジュール管理</h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView(item.id as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <h2 className="text-lg font-semibold mb-4">メニュー</h2>
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "default" : "outline"}
                        className="flex items-center gap-3 justify-start h-12 text-base"
                        onClick={() => {
                          setCurrentView(item.id as any)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {currentView === "calendar" && <Calendar />}
        {currentView === "form" && <ProjectForm onSubmit={() => setCurrentView("calendar")} />}
        {currentView === "staff" && <StaffManagement />}
        {currentView === "export" && <DataExport />}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation currentView={currentView} onViewChange={setCurrentView} navigationItems={navigationItems} />
    </div>
  )
}
