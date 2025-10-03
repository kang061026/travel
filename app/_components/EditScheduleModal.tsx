'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabaseClient'

type Item = {
  id: string
  title: string
  time_range: string | null
  amount: number | null
}

export default function EditScheduleModal({
  open,
  onClose,
  item
}: {
  open: boolean
  onClose: () => void
  item: Item | null
}) {
  const [title, setTitle] = useState('')
  const [timeRange, setTimeRange] = useState('')
  const [amount, setAmount] = useState<string>('')
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    if (item) {
      setTitle(item.title ?? '')
      setTimeRange(item.time_range ?? '')
      setAmount(item.amount != null ? String(item.amount) : '')
    }
  }, [item])

  const save = async () => {
    if (!item) return
    const payload: any = { title: title.trim() || item.title }
    payload.time_range = timeRange.trim() || null
    payload.amount = amount.trim() ? Number(amount.replace(/,/g, '')) : null
    await supabase.from('schedules').update(payload).eq('id', item.id)
    onClose()
  }

  const remove = async () => {
    if (!item) return
    await supabase.from('schedules').delete().eq('id', item.id)
    onClose()
  }

  if (!open || !item) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50">
      <div className="w-full md:max-w-lg card p-4 space-y-3">
        <h3 className="text-lg font-semibold">일정 수정</h3>
        <input className="input-text" placeholder="일정명" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="input-text" placeholder="시간 (예: 09:00 ~ 10:00)" value={timeRange} onChange={(e)=>setTimeRange(e.target.value)} />
        <input className="input-text" placeholder="금액(선택)" inputMode="numeric" value={amount} onChange={(e)=>setAmount(e.target.value)} />
        <div className="flex justify-between pt-1">
          <button onClick={remove} className="px-4 py-2 rounded-lg border border-red-500 text-red-600">삭제</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border">취소</button>
            <button onClick={save} className="button-primary">저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}
