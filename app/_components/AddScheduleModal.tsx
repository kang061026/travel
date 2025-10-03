'use client'
import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabaseClient'
import { TabKey } from '@/lib/utils'

export default function AddScheduleModal({
  open,
  onClose,
  tab
}: {
  open: boolean
  onClose: () => void
  tab: TabKey
}) {
  const [title, setTitle] = useState('')
  const [timeRange, setTimeRange] = useState('')
  const [amount, setAmount] = useState<string>('')
  const supabase = createSupabaseBrowser()

  const save = async () => {
    if (!title.trim()) return
    const payload: any = { tab_name: tab, title: title.trim() }
    if (timeRange.trim()) payload.time_range = timeRange.trim()
    if (amount.trim()) payload.amount = Number(amount.replace(/,/g, ''))
    await supabase.from('schedules').insert(payload)
    setTitle('')
    setTimeRange('')
    setAmount('')
    onClose()
  }

  // 엔터 입력 시 저장
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      save()
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50">
      <div className="w-full md:max-w-lg card p-4 space-y-3">
        <h3 className="text-lg font-semibold">일정 추가</h3>
        <input
          className="input"
          placeholder="일정명"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="input"
          placeholder="시간 (예: 09:00 ~ 10:00)"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="input"
          placeholder="금액(선택)"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="btn btn-secondary">취소</button>
          <button onClick={save} className="btn btn-primary">저장</button>
        </div>
      </div>
    </div>
  )
}
