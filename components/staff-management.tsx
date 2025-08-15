"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StaffMember {
  id: string
  name: string
  color: string
  position?: string
  phone?: string
  email?: string
}

const colorOptions = [
  { value: "bg-blue-500", label: "青", preview: "bg-blue-500" },
  { value: "bg-green-500", label: "緑", preview: "bg-green-500" },
  { value: "bg-orange-500", label: "オレンジ", preview: "bg-orange-500" },
  { value: "bg-purple-500", label: "紫", preview: "bg-purple-500" },
  { value: "bg-red-500", label: "赤", preview: "bg-red-500" },
  { value: "bg-yellow-500", label: "黄", preview: "bg-yellow-500" },
  { value: "bg-pink-500", label: "ピンク", preview: "bg-pink-500" },
  { value: "bg-indigo-500", label: "藍", preview: "bg-indigo-500" },
  { value: "bg-teal-500", label: "ティール", preview: "bg-teal-500" },
  { value: "bg-cyan-500", label: "シアン", preview: "bg-cyan-500" },
]

export function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: "1", name: "田中太郎", color: "bg-blue-500", position: "主任", phone: "090-1234-5678" },
    { id: "2", name: "佐藤花子", color: "bg-green-500", position: "技術者", phone: "090-2345-6789" },
    { id: "3", name: "鈴木一郎", color: "bg-orange-500", position: "技術者", phone: "090-3456-7890" },
    { id: "4", name: "高橋美咲", color: "bg-purple-500", position: "アシスタント", phone: "090-4567-8901" },
    { id: "5", name: "山田健太", color: "bg-red-500", position: "技術者", phone: "090-5678-9012" },
  ])

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    color: "bg-blue-500",
    position: "",
    phone: "",
    email: "",
  })

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.color) {
      const id = Date.now().toString()
      setStaffMembers([...staffMembers, { ...newStaff, id } as StaffMember])
      setNewStaff({ name: "", color: "bg-blue-500", position: "", phone: "", email: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff({ ...staff })
  }

  const handleSaveEdit = () => {
    if (editingStaff) {
      setStaffMembers(staffMembers.map((staff) => (staff.id === editingStaff.id ? editingStaff : staff)))
      setEditingStaff(null)
    }
  }

  const handleDeleteStaff = (id: string) => {
    if (confirm("この担当者を削除してもよろしいですか？")) {
      setStaffMembers(staffMembers.filter((staff) => staff.id !== id))
    }
  }

  const getColorLabel = (colorValue: string) => {
    return colorOptions.find((option) => option.value === colorValue)?.label || "不明"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">担当者管理</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              担当者を追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい担当者を追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">氏名 *</Label>
                <Input
                  id="new-name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="氏名を入力してください"
                />
              </div>
              <div className="space-y-2">
                <Label>カレンダー表示色 *</Label>
                <Select value={newStaff.color} onValueChange={(value) => setNewStaff({ ...newStaff, color: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${option.preview}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-position">役職</Label>
                <Input
                  id="new-position"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                  placeholder="役職を入力してください"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone">電話番号</Label>
                <Input
                  id="new-phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="090-1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">メールアドレス</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="example@company.com"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddStaff} className="flex-1">
                  追加
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staffMembers.map((staff) => (
          <Card key={staff.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${staff.color}`} />
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditStaff(staff)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(staff.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {staff.position && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{staff.position}</Badge>
                </div>
              )}
              {staff.phone && (
                <div className="text-sm text-muted-foreground">
                  <strong>電話:</strong> {staff.phone}
                </div>
              )}
              {staff.email && (
                <div className="text-sm text-muted-foreground">
                  <strong>メール:</strong> {staff.email}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                <strong>表示色:</strong> {getColorLabel(staff.color)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 編集ダイアログ */}
      {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>担当者情報を編集</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">氏名 *</Label>
                <Input
                  id="edit-name"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>カレンダー表示色 *</Label>
                <Select
                  value={editingStaff.color}
                  onValueChange={(value) => setEditingStaff({ ...editingStaff, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${option.preview}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">役職</Label>
                <Input
                  id="edit-position"
                  value={editingStaff.position || ""}
                  onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">電話番号</Label>
                <Input
                  id="edit-phone"
                  value={editingStaff.phone || ""}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">メールアドレス</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingStaff.email || ""}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  保存
                </Button>
                <Button variant="outline" onClick={() => setEditingStaff(null)}>
                  <X className="h-4 w-4" />
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
