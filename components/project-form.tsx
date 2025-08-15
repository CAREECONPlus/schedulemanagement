"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Search, Database, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"

const staffMembers = [
  { id: "1", name: "田中太郎", color: "#3b82f6" },
  { id: "2", name: "佐藤花子", color: "#22c55e" },
  { id: "3", name: "鈴木一郎", color: "#f97316" },
  { id: "4", name: "高橋美咲", color: "#8b5cf6" },
  { id: "5", name: "山田健太", color: "#ef4444" },
]

const mockFileMakerData = {
  contractors: [
    { id: "1", name: "株式会社建設太郎", code: "KT001" },
    { id: "2", name: "山田建設株式会社", code: "YK002" },
    { id: "3", name: "東京工業株式会社", code: "TK003" },
    { id: "4", name: "関東建築株式会社", code: "KK004" },
  ],
  estimates: [
    { id: "1", number: "EST-2024-001", contractorId: "1", projectName: "オフィスビル改修工事" },
    { id: "2", number: "EST-2024-002", contractorId: "2", projectName: "住宅基礎工事" },
    { id: "3", number: "EST-2024-003", contractorId: "1", projectName: "道路舗装工事" },
    { id: "4", number: "EST-2024-004", contractorId: "3", projectName: "橋梁補修工事" },
  ],
}

interface ProjectFormProps {
  onSubmit: () => void
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [workPeriodStart, setWorkPeriodStart] = useState<Date | null>(null)
  const [workPeriodEnd, setWorkPeriodEnd] = useState<Date | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [contractorSearch, setContractorSearch] = useState("")
  const [estimateSearch, setEstimateSearch] = useState("")
  const [filteredContractors, setFilteredContractors] = useState(mockFileMakerData.contractors)
  const [filteredEstimates, setFilteredEstimates] = useState(mockFileMakerData.estimates)
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false)
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false)
  const [constructionPeriodStart, setConstructionPeriodStart] = useState<Date | null>(null)
  const [constructionPeriodEnd, setConstructionPeriodEnd] = useState<Date | null>(null)
  const [isConstructionStartCalendarOpen, setIsConstructionStartCalendarOpen] = useState(false)
  const [isConstructionEndCalendarOpen, setIsConstructionEndCalendarOpen] = useState(false)

  const [formData, setFormData] = useState({
    siteName: "",
    workContent: "",
    contractorId: "",
    estimateId: "",
    notes: "",
  })

  useEffect(() => {
    const savedData = localStorage.getItem("projectFormData")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || formData)
        setSelectedStaff(parsed.selectedStaff || [])
        if (parsed.workPeriodStart) setWorkPeriodStart(new Date(parsed.workPeriodStart))
        if (parsed.workPeriodEnd) setWorkPeriodEnd(new Date(parsed.workPeriodEnd))
        if (parsed.constructionPeriodStart) setConstructionPeriodStart(new Date(parsed.constructionPeriodStart))
        if (parsed.constructionPeriodEnd) setConstructionPeriodEnd(new Date(parsed.constructionPeriodEnd))
      } catch (error) {
        console.error("Failed to load saved form data:", error)
      }
    }
  }, [])

  useEffect(() => {
    const dataToSave = {
      formData,
      selectedStaff,
      workPeriodStart: workPeriodStart?.toISOString(),
      workPeriodEnd: workPeriodEnd?.toISOString(),
      constructionPeriodStart: constructionPeriodStart?.toISOString(),
      constructionPeriodEnd: constructionPeriodEnd?.toISOString(),
    }
    localStorage.setItem("projectFormData", JSON.stringify(dataToSave))
  }, [formData, selectedStaff, workPeriodStart, workPeriodEnd, constructionPeriodStart, constructionPeriodEnd])

  const addStaffMember = (staffId: string) => {
    if (!selectedStaff.includes(staffId)) {
      setSelectedStaff([...selectedStaff, staffId])
    }
  }

  const removeStaffMember = (staffId: string) => {
    setSelectedStaff(selectedStaff.filter((id) => id !== staffId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!workPeriodStart || !workPeriodEnd) {
      toast({
        title: "エラー",
        description: "作業期間を選択してください",
        variant: "destructive",
      })
      return
    }

    if (selectedStaff.length === 0) {
      toast({
        title: "エラー",
        description: "担当者を選択してください",
        variant: "destructive",
      })
      return
    }

    const projectData = {
      id: Date.now().toString(),
      ...formData,
      workPeriodStart: workPeriodStart.toISOString(),
      workPeriodEnd: workPeriodEnd.toISOString(),
      constructionPeriodStart: constructionPeriodStart?.toISOString(),
      constructionPeriodEnd: constructionPeriodEnd?.toISOString(),
      selectedStaff,
      createdAt: new Date().toISOString(),
    }

    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    existingProjects.push(projectData)
    localStorage.setItem("projects", JSON.stringify(existingProjects))

    localStorage.removeItem("projectFormData")

    toast({
      title: "成功",
      description: "プロジェクトが正常に登録されました",
    })

    console.log("Project submitted:", projectData)
    onSubmit()
  }

  const getStaffMember = (id: string) => staffMembers.find((staff) => staff.id === id)
  const getContractor = (id: string) => mockFileMakerData.contractors.find((contractor) => contractor.id === id)
  const getEstimate = (id: string) => mockFileMakerData.estimates.find((estimate) => estimate.id === id)

  const MiniCalendar = ({
    selectedDate,
    onDateSelect,
    isOpen,
    setIsOpen,
  }: {
    selectedDate: Date | null
    onDateSelect: (date: Date) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
  }) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

    const monthDays = useMemo(() => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days = []
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
      }
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
      }
      return days
    }, [currentMonth])

    const changeMonth = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newDate = new Date(prev)
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
        return newDate
      })
    }

    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"]

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-12 justify-start text-left font-normal border-2 focus:border-primary transition-colors bg-transparent"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? selectedDate.toLocaleDateString("ja-JP") : "日付を選択"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={() => changeMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">
                {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
              </h3>
              <Button variant="outline" size="sm" onClick={() => changeMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((date, index) => {
                const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString()
                const isToday = date && date.toDateString() === new Date().toDateString()

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (date) {
                        onDateSelect(date)
                        setIsOpen(false)
                      }
                    }}
                    className={`h-8 text-sm rounded transition-colors ${
                      date
                        ? `hover:bg-accent ${isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-accent" : ""}`
                        : "text-muted-foreground cursor-not-allowed"
                    }`}
                    disabled={!date}
                  >
                    {date?.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">案件登録フォーム</h1>
          <p className="text-muted-foreground text-sm sm:text-base">効率的にプロジェクトを管理しましょう</p>
        </div>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-secondary/20">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Database className="h-5 w-5" />
              プロジェクト詳細
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-destructive/20">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <h3 className="text-base sm:text-lg font-semibold text-destructive">必須項目</h3>
              </div>

              <div className="space-y-3">
                <Label htmlFor="siteName" className="text-sm sm:text-base font-semibold">
                  現場名 *
                </Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="現場名を入力してください"
                  required
                  className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-semibold">現場に入る期間 *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">開始日</Label>
                    <MiniCalendar
                      selectedDate={workPeriodStart}
                      onDateSelect={setWorkPeriodStart}
                      isOpen={isStartCalendarOpen}
                      setIsOpen={setIsStartCalendarOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">終了日</Label>
                    <MiniCalendar
                      selectedDate={workPeriodEnd}
                      onDateSelect={setWorkPeriodEnd}
                      isOpen={isEndCalendarOpen}
                      setIsOpen={setIsEndCalendarOpen}
                    />
                  </div>
                </div>
                {workPeriodStart && workPeriodEnd && (
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="font-medium text-primary text-sm sm:text-base">
                      作業期間: {workPeriodStart.toLocaleDateString("ja-JP")} 〜{" "}
                      {workPeriodEnd.toLocaleDateString("ja-JP")}
                      <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                        ({Math.ceil((workPeriodEnd.getTime() - workPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1}
                        日間)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="workContent" className="text-sm sm:text-base font-semibold">
                  作業内容/概要 *
                </Label>
                <Textarea
                  id="workContent"
                  value={formData.workContent}
                  onChange={(e) => setFormData({ ...formData, workContent: e.target.value })}
                  placeholder="作業内容や概要を入力してください（顧客からのメールなどをコピー＆ペーストできます）"
                  rows={4}
                  required
                  className="text-sm sm:text-base border-2 focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-semibold">担当者 *</Label>

                {selectedStaff.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg border-2">
                    {selectedStaff.map((staffId) => {
                      const staff = getStaffMember(staffId)
                      return staff ? (
                        <Badge
                          key={staffId}
                          variant="secondary"
                          className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                          style={{ backgroundColor: `${staff.color}20`, borderColor: staff.color }}
                        >
                          <div
                            className="w-2 sm:w-3 h-2 sm:h-3 rounded-full"
                            style={{ backgroundColor: staff.color }}
                          ></div>
                          <span className="truncate max-w-[100px] sm:max-w-none">{staff.name}</span>
                          <button
                            type="button"
                            onClick={() => removeStaffMember(staffId)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-2 sm:h-3 w-2 sm:w-3" />
                          </button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}

                <Select onValueChange={addStaffMember}>
                  <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors">
                    <SelectValue placeholder="担当者を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers
                      .filter((staff) => !selectedStaff.includes(staff.id))
                      .map((staff) => (
                        <SelectItem key={staff.id} value={staff.id} className="py-2 sm:py-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="w-3 sm:w-4 h-3 sm:h-4 rounded-full"
                              style={{ backgroundColor: staff.color }}
                            ></div>
                            <span className="text-sm sm:text-base">{staff.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedStaff.length === 0 && (
                  <p className="text-xs sm:text-sm text-destructive">少なくとも1人の担当者を選択してください</p>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t-2 border-dashed border-muted">
              <div className="flex items-center gap-2 pb-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">任意項目</h3>
              </div>

              <div className="space-y-3">
                <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  元請け（請求先）
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="元請け会社を検索..."
                    value={contractorSearch}
                    onChange={(e) => setContractorSearch(e.target.value)}
                    className="h-12 pl-10 text-base border-2 focus:border-primary transition-colors"
                  />
                </div>
                {contractorSearch && (
                  <div className="border-2 rounded-lg bg-card max-h-40 overflow-y-auto">
                    {filteredContractors.map((contractor) => (
                      <button
                        key={contractor.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, contractorId: contractor.id })
                          setContractorSearch(contractor.name)
                        }}
                        className="w-full text-left p-3 hover:bg-accent/10 transition-colors border-b last:border-b-0"
                      >
                        <div className="font-medium">{contractor.name}</div>
                        <div className="text-sm text-muted-foreground">コード: {contractor.code}</div>
                      </button>
                    ))}
                  </div>
                )}
                {formData.contractorId && (
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="font-medium text-primary">
                      選択済み: {getContractor(formData.contractorId)?.name}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  見積書番号
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="見積書番号を検索..."
                    value={estimateSearch}
                    onChange={(e) => setEstimateSearch(e.target.value)}
                    className="h-12 pl-10 text-base border-2 focus:border-primary transition-colors"
                  />
                </div>
                {estimateSearch && (
                  <div className="border-2 rounded-lg bg-card max-h-40 overflow-y-auto">
                    {filteredEstimates.map((estimate) => (
                      <button
                        key={estimate.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, estimateId: estimate.id })
                          setEstimateSearch(estimate.number)
                        }}
                        className="w-full text-left p-3 hover:bg-accent/10 transition-colors border-b last:border-b-0"
                      >
                        <div className="font-medium">{estimate.number}</div>
                        <div className="text-sm text-muted-foreground">{estimate.projectName}</div>
                      </button>
                    ))}
                  </div>
                )}
                {formData.estimateId && (
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="font-medium text-primary">選択済み: {getEstimate(formData.estimateId)?.number}</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  工期（全体期間）
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">開始日</Label>
                    <MiniCalendar
                      selectedDate={constructionPeriodStart}
                      onDateSelect={setConstructionPeriodStart}
                      isOpen={isConstructionStartCalendarOpen}
                      setIsOpen={setIsConstructionStartCalendarOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">終了日</Label>
                    <MiniCalendar
                      selectedDate={constructionPeriodEnd}
                      onDateSelect={setConstructionPeriodEnd}
                      isOpen={isConstructionEndCalendarOpen}
                      setIsOpen={setIsConstructionEndCalendarOpen}
                    />
                  </div>
                </div>
                {constructionPeriodStart && constructionPeriodEnd && (
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="font-medium text-primary text-sm sm:text-base">
                      工期: {constructionPeriodStart.toLocaleDateString("ja-JP")} 〜{" "}
                      {constructionPeriodEnd.toLocaleDateString("ja-JP")}
                      <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                        (
                        {Math.ceil(
                          (constructionPeriodEnd.getTime() - constructionPeriodStart.getTime()) / (1000 * 60 * 60 * 24),
                        ) + 1}
                        日間)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm sm:text-base font-semibold">
                  備考
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="その他の備考があれば入力してください"
                  rows={3}
                  className="text-sm sm:text-base border-2 focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-semibold">写真添付</Label>
                <div className="border-2 border-dashed border-accent rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-3 text-accent" />
                  <p className="text-base sm:text-lg font-medium mb-2">写真をドラッグ＆ドロップ</p>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">または</p>
                  <input type="file" multiple accept="image/*" className="hidden" id="photo-upload" />
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors inline-block"
                  >
                    ファイルを選択
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold bg-primary hover:bg-primary/90 transition-all transform hover:scale-105"
            disabled={selectedStaff.length === 0 || !workPeriodStart || !workPeriodEnd}
          >
            プロジェクトを登録
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSubmit}
            className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-medium border-2 hover:bg-secondary transition-colors bg-transparent"
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
