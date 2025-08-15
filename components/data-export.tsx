"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Table, Code, Calendar, Database } from "lucide-react"

// サンプルデータ（実際の実装では状態管理から取得）
const sampleProjects = [
  {
    id: "1",
    siteName: "A現場 配管工事",
    staffId: "1",
    staffName: "田中太郎",
    date: "2024-01-15",
    workContent: "給水管の交換作業",
    contractor: "ABC建設株式会社",
    estimateNumber: "EST-2024-001",
    workPeriod: "2024-01-15〜2024-01-20",
    notes: "緊急対応案件",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "2",
    siteName: "B現場 メンテナンス",
    staffId: "2",
    staffName: "佐藤花子",
    date: "2024-01-15",
    workContent: "定期点検および清掃",
    contractor: "XYZ工業株式会社",
    estimateNumber: "EST-2024-002",
    workPeriod: "2024-01-15〜2024-01-16",
    notes: "月次定期点検",
    createdAt: "2024-01-12T14:30:00Z",
  },
]

const sampleStaff = [
  {
    id: "1",
    name: "田中太郎",
    color: "bg-blue-500",
    position: "主任",
    phone: "090-1234-5678",
    email: "tanaka@company.com",
  },
  {
    id: "2",
    name: "佐藤花子",
    color: "bg-green-500",
    position: "技術者",
    phone: "090-2345-6789",
    email: "sato@company.com",
  },
  {
    id: "3",
    name: "鈴木一郎",
    color: "bg-orange-500",
    position: "技術者",
    phone: "090-3456-7890",
    email: "suzuki@company.com",
  },
]

export function DataExport() {
  const [exportType, setExportType] = useState<"projects" | "staff" | "both">("projects")
  const [format, setFormat] = useState<"csv" | "excel" | "json">("csv")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<string>("all")
  const [includeNotes, setIncludeNotes] = useState(true)
  const [fileMakerFormat, setFileMakerFormat] = useState(false)

  // CSV形式でデータを変換
  const convertToCSV = (data: any[], headers: string[]) => {
    const csvHeaders = headers.join(",")
    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || ""
          // CSVエスケープ処理
          return typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))
            ? `"${value.replace(/"/g, '""')}"`
            : value
        })
        .join(","),
    )
    return [csvHeaders, ...csvRows].join("\n")
  }

  // FileMaker形式のフィールドマッピング
  const mapToFileMakerFormat = (projects: any[]) => {
    return projects.map((project) => ({
      受注番号: project.id,
      現場名: project.siteName,
      作業日: project.date,
      担当者: project.staffName,
      作業内容: project.workContent,
      元請け: project.contractor || "",
      見積書番号: project.estimateNumber || "",
      工期: project.workPeriod || "",
      備考: includeNotes ? project.notes || "" : "",
      登録日時: new Date(project.createdAt).toLocaleString("ja-JP"),
    }))
  }

  // データをフィルタリング
  const getFilteredData = () => {
    let filteredProjects = [...sampleProjects]

    // 日付フィルター
    if (dateFrom) {
      filteredProjects = filteredProjects.filter((p) => p.date >= dateFrom)
    }
    if (dateTo) {
      filteredProjects = filteredProjects.filter((p) => p.date <= dateTo)
    }

    // 担当者フィルター
    if (selectedStaff !== "all") {
      filteredProjects = filteredProjects.filter((p) => p.staffId === selectedStaff)
    }

    return filteredProjects
  }

  // エクスポート実行
  const handleExport = () => {
    const filteredProjects = getFilteredData()
    let dataToExport: any[] = []
    let filename = ""
    let headers: string[] = []

    if (exportType === "projects" || exportType === "both") {
      if (fileMakerFormat) {
        dataToExport = mapToFileMakerFormat(filteredProjects)
        headers = Object.keys(dataToExport[0] || {})
        filename = `案件データ_FileMaker形式_${new Date().toISOString().split("T")[0]}`
      } else {
        dataToExport = filteredProjects
        headers = [
          "id",
          "siteName",
          "staffName",
          "date",
          "workContent",
          "contractor",
          "estimateNumber",
          "workPeriod",
          "notes",
          "createdAt",
        ]
        filename = `案件データ_${new Date().toISOString().split("T")[0]}`
      }
    }

    if (exportType === "staff" || exportType === "both") {
      if (exportType === "both") {
        // 両方の場合は別々にエクスポート
        exportStaffData()
      } else {
        dataToExport = sampleStaff
        headers = ["id", "name", "position", "phone", "email", "color"]
        filename = `担当者データ_${new Date().toISOString().split("T")[0]}`
      }
    }

    if (dataToExport.length === 0) {
      alert("エクスポートするデータがありません。")
      return
    }

    // ファイル生成とダウンロード
    let content = ""
    let mimeType = ""
    let fileExtension = ""

    switch (format) {
      case "csv":
        content = convertToCSV(dataToExport, headers)
        mimeType = "text/csv;charset=utf-8;"
        fileExtension = ".csv"
        break
      case "json":
        content = JSON.stringify(dataToExport, null, 2)
        mimeType = "application/json;charset=utf-8;"
        fileExtension = ".json"
        break
      case "excel":
        // 簡易的なTSV形式（Excelで開ける）
        content = convertToCSV(dataToExport, headers).replace(/,/g, "\t")
        mimeType = "text/tab-separated-values;charset=utf-8;"
        fileExtension = ".tsv"
        break
    }

    // BOMを追加（日本語文字化け対策）
    const bom = "\uFEFF"
    const blob = new Blob([bom + content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename + fileExtension
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 担当者データのエクスポート
  const exportStaffData = () => {
    const headers = ["id", "name", "position", "phone", "email", "color"]
    let content = ""
    const filename = `担当者データ_${new Date().toISOString().split("T")[0]}`

    switch (format) {
      case "csv":
        content = convertToCSV(sampleStaff, headers)
        break
      case "json":
        content = JSON.stringify(sampleStaff, null, 2)
        break
      case "excel":
        content = convertToCSV(sampleStaff, headers).replace(/,/g, "\t")
        break
    }

    const mimeType = format === "json" ? "application/json;charset=utf-8;" : "text/csv;charset=utf-8;"
    const fileExtension = format === "json" ? ".json" : format === "excel" ? ".tsv" : ".csv"

    const bom = "\uFEFF"
    const blob = new Blob([bom + content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename + fileExtension
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">データ出力</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* エクスポート設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              エクスポート設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* データ種別 */}
            <div className="space-y-2">
              <Label>エクスポートするデータ</Label>
              <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="projects">案件データのみ</SelectItem>
                  <SelectItem value="staff">担当者データのみ</SelectItem>
                  <SelectItem value="both">両方（別々のファイル）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ファイル形式 */}
            <div className="space-y-2">
              <Label>ファイル形式</Label>
              <Select value={format} onValueChange={(value: any) => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV形式
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      Excel形式（TSV）
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      JSON形式
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FileMaker形式オプション */}
            {exportType !== "staff" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filemaker-format"
                  checked={fileMakerFormat}
                  onCheckedChange={(checked) => setFileMakerFormat(checked as boolean)}
                />
                <Label htmlFor="filemaker-format" className="text-sm">
                  FileMaker連携用フィールド名で出力
                </Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* フィルター設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              フィルター設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exportType !== "staff" && (
              <>
                {/* 日付範囲 */}
                <div className="space-y-2">
                  <Label>作業日範囲</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                        開始日
                      </Label>
                      <Input
                        id="date-from"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                        終了日
                      </Label>
                      <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 担当者フィルター */}
                <div className="space-y-2">
                  <Label>担当者</Label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全担当者</SelectItem>
                      {sampleStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* 追加オプション */}
                <div className="space-y-2">
                  <Label>追加オプション</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-notes"
                      checked={includeNotes}
                      onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
                    />
                    <Label htmlFor="include-notes" className="text-sm">
                      備考欄を含める
                    </Label>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* プレビュー情報 */}
      <Card>
        <CardHeader>
          <CardTitle>エクスポート予定データ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{getFilteredData().length}</div>
              <div className="text-sm text-muted-foreground">案件数</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{sampleStaff.length}</div>
              <div className="text-sm text-muted-foreground">担当者数</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{format.toUpperCase()}</div>
              <div className="text-sm text-muted-foreground">出力形式</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{fileMakerFormat ? "ON" : "OFF"}</div>
              <div className="text-sm text-muted-foreground">FileMaker形式</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* エクスポート実行 */}
      <div className="flex justify-center">
        <Button onClick={handleExport} size="lg" className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          データをエクスポート
        </Button>
      </div>
    </div>
  )
}
