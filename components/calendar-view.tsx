"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Filter, Search, Plus, Edit, Trash2, CalendarIcon } from "lucide-react"

const staffMembers = [
  { id: "1", name: "田中太郎", color: "#3b82f6" },
  { id: "2", name: "佐藤花子", color: "#22c55e" },
  { id: "3", name: "鈴木一郎", color: "#f97316" },
  { id: "4", name: "高橋美咲", color: "#8b5cf6" },
  { id: "5", name: "山田健太", color: "#ef4444" },
]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  const currentYear = currentDate.getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects")
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects))
      } catch (error) {
        console.error("Failed to load projects:", error)
      }
    }
  }, [])

  // 現在の月の日付を生成
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // 前月の日付を埋める
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // 当月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [currentDate])

  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Staff filter
    if (selectedStaff !== "all") {
      filtered = filtered.filter((project) => project.selectedStaff && project.selectedStaff.includes(selectedStaff))
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.workContent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.contractor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.estimateNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [selectedStaff, searchQuery, projects])

  const getProjectsForDate = (date: Date | null) => {
    if (!date) return []

    return filteredProjects.filter((project) => {
      if (project.workPeriodStart && project.workPeriodEnd) {
        const startDate = new Date(project.workPeriodStart)
        const endDate = new Date(project.workPeriodEnd)
        const checkDate = new Date(date)

        // Reset time to compare dates only
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        checkDate.setHours(0, 0, 0, 0)

        return checkDate >= startDate && checkDate <= endDate
      }
      return false
    })
  }

  const getProjectPeriodInfo = (date: Date, project: any) => {
    if (!project.workPeriodStart || !project.workPeriodEnd) return null

    const startDate = new Date(project.workPeriodStart)
    const endDate = new Date(project.workPeriodEnd)
    const checkDate = new Date(date)

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    checkDate.setHours(0, 0, 0, 0)

    if (checkDate.getTime() === startDate.getTime() && checkDate.getTime() === endDate.getTime()) {
      return "single"
    } else if (checkDate.getTime() === startDate.getTime()) {
      return "start"
    } else if (checkDate.getTime() === endDate.getTime()) {
      return "end"
    } else if (checkDate >= startDate && checkDate <= endDate) {
      return "middle"
    }

    return null
  }

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const changeYear = (year: string) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(Number.parseInt(year))
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
    setEditingProject(null)
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
  }

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => changeMonth("prev")} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              <Select value={currentYear.toString()} onValueChange={changeYear}>
                <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <h2 className="text-lg sm:text-xl font-bold text-primary min-w-[50px] sm:min-w-[60px] text-center">
                {monthNames[currentDate.getMonth()]}
              </h2>
            </div>

            <Button variant="outline" size="sm" onClick={() => changeMonth("next")} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Search functionality */}
            <div className="relative flex-1 lg:w-48 xl:w-64">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="現場名、作業内容で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 h-8 sm:h-10 text-xs sm:text-sm border-2 focus:border-primary"
              />
            </div>

            {/* Staff filter */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-full sm:w-40 lg:w-48 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全担当者</SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{ backgroundColor: staff.color }} />
                        <span className="text-xs sm:text-sm">{staff.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-secondary/10">
        <CardHeader className="bg-primary text-primary-foreground p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            案件・スケジュール管理
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-bold text-primary py-2 sm:py-3 bg-primary/10 rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((date, index) => {
              const projects = getProjectsForDate(date)
              const isToday = date && date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border-2 rounded-lg transition-all duration-200 ${
                    date
                      ? "bg-background hover:bg-secondary/20 cursor-pointer hover:border-primary hover:shadow-md"
                      : "bg-muted/30 border-muted"
                  } ${isToday ? "ring-1 sm:ring-2 ring-primary border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => date && handleDateClick(date)}
                >
                  {date && (
                    <>
                      <div
                        className={`text-xs sm:text-sm font-bold mb-1 sm:mb-2 ${isToday ? "text-primary" : "text-foreground"}`}
                      >
                        {date.getDate()}
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        {projects.slice(0, 2).map((project) => {
                          const assignedStaff = project.selectedStaff || []
                          const periodInfo = getProjectPeriodInfo(date, project)

                          return (
                            <div key={project.id} className="space-y-0.5">
                              {assignedStaff.map((staffId: string, staffIndex: number) => {
                                const staff = staffMembers.find((s) => s.id === staffId)
                                if (!staff) return null

                                return (
                                  <div
                                    key={`${project.id}-${staffId}`}
                                    className={`text-xs p-0.5 sm:p-1 w-full text-white rounded-sm sm:rounded transition-opacity relative ${
                                      periodInfo === "start"
                                        ? "rounded-r-none"
                                        : periodInfo === "end"
                                          ? "rounded-l-none"
                                          : periodInfo === "middle"
                                            ? "rounded-none"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: staff.color }}
                                  >
                                    <div className="truncate text-xs font-medium">
                                      {periodInfo === "start" || periodInfo === "single"
                                        ? `${project.siteName}${assignedStaff.length > 1 ? ` (${staff.name})` : ""}`
                                        : ""}
                                      {periodInfo === "middle" && "━━━"}
                                      {periodInfo === "end" && "━━━"}
                                    </div>
                                    {/* Period continuation indicators */}
                                    {periodInfo === "start" && (
                                      <div className="absolute top-0 right-0 w-1 h-full bg-current opacity-50"></div>
                                    )}
                                    {periodInfo === "end" && (
                                      <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-50"></div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })}
                        {projects.length > 2 && (
                          <div className="text-xs text-primary font-medium text-center bg-primary/10 rounded px-0.5 sm:px-1 py-0.5">
                            +{projects.length - 2}件
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {selectedDate?.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}{" "}
              の案件詳細
            </DialogTitle>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4">
              {getProjectsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>この日の案件はありません</p>
                  <Button className="mt-4" onClick={() => setIsDialogOpen(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    新しい案件を追加
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getProjectsForDate(selectedDate).map((project) => {
                    const assignedStaff = project.selectedStaff || []
                    const staffNames = assignedStaff
                      .map((staffId: string) => staffMembers.find((s) => s.id === staffId)?.name)
                      .filter(Boolean)
                      .join(", ")

                    return (
                      <Card key={project.id} className="border-2 hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                {assignedStaff.map((staffId: string) => {
                                  const staff = staffMembers.find((s) => s.id === staffId)
                                  return staff ? (
                                    <div
                                      key={staffId}
                                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                      style={{ backgroundColor: staff.color }}
                                      title={staff.name}
                                    />
                                  ) : null
                                })}
                              </div>
                              <h3 className="font-bold text-lg text-primary">{project.siteName}</h3>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:border-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-semibold text-muted-foreground">担当者</Label>
                              <p className="font-medium">{staffNames || "未設定"}</p>
                            </div>
                            <div>
                              <Label className="font-semibold text-muted-foreground">元請け</Label>
                              <p className="font-medium">{project.contractor}</p>
                            </div>
                            <div>
                              <Label className="font-semibold text-muted-foreground">見積書番号</Label>
                              <p className="font-medium">{project.estimateNumber}</p>
                            </div>
                            <div>
                              <Label className="font-semibold text-muted-foreground">作業内容</Label>
                              <p className="font-medium">{project.workContent}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 凡例 */}
      <Card className="shadow-md">
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-primary">担当者凡例</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 sm:gap-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center gap-1 sm:gap-2">
                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full" style={{ backgroundColor: staff.color }} />
                <span className="text-xs sm:text-sm font-medium truncate">{staff.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
