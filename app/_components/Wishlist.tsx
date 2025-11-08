'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabaseClient'
import { TabKey } from '@/lib/utils'

type W = { id: string; type: 'food' | 'place'; content: string; created_at: string }

export default function Wishlist({ tab }: { tab: Extract<TabKey, 'food' | 'place'> }) {
  const supabase = createSupabaseBrowser()
  const [items, setItems] = useState<W[]>([])
  const [value, setValue] = useState('')
  const label = tab === 'food' ? '먹고싶은 것' : '가고싶은 곳'

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabase
        .from('wishlist')
        .select('*')
        .eq('type', tab)
        .order('created_at', { ascending: true })
      if (mounted) setItems((data as W[]) || [])
    }
    load()

    const ch = supabase
      .channel(`wish-${tab}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishlist', filter: `type=eq.${tab}` },
        (payload) => {
          setItems((cur) => {
            if (payload.eventType === 'INSERT') return [...cur, payload.new as W]
            if (payload.eventType === 'UPDATE') return cur.map(x => x.id === (payload.new as W).id ? (payload.new as W) : x)
            if (payload.eventType === 'DELETE') return cur.filter(x => x.id !== (payload.old as W).id)
            return cur
          })
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [tab])

  const add = async () => {
    if (!value.trim()) return
    await supabase.from('wishlist').insert({ type: tab, content: value.trim() })
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div className="space-y-3">
      {/* 모바일: 세로 배치 → 버튼이 가로로 짤리지 않음
          sm 이상: 가로 배치 */}
      <div className="flex flex-col sm:flex-row gap-2 min-w-0">
        <input
          className="input flex-1 min-w-0"
          placeholder={`${label} 입력`}
          value={value}
          onChange={(e)=>setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={add}
          className="btn btn-primary w-full sm:w-auto shrink-0"
        >
          {label} 추가
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((w) => (
          <li key={w.id} className="card p-4 flex items-center justify-between">
            <span className="truncate">{w.content}</span>
            <button onClick={() => supabase.from('wishlist').delete().eq('id', w.id)} className="btn btn-secondary">
              삭제
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-graytone-ash">등록된 항목이 없습니다.</li>}
      </ul>
    </div>
  )
}
