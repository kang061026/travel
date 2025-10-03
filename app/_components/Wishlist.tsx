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

  // 초기 로드 + 실시간 구독
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
            if (payload.eventType === 'UPDATE')
              return cur.map((x) => (x.id === (payload.new as W).id ? (payload.new as W) : x))
            if (payload.eventType === 'DELETE')
              return cur.filter((x) => x.id !== (payload.old as W).id)
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

  // 추가
  const add = async () => {
    if (!value.trim()) return
    await supabase.from('wishlist').insert({ type: tab, content: value.trim() })
    setValue('')
  }

  // 삭제
  const remove = async (id: string) => {
    await supabase.from('wishlist').delete().eq('id', id)
  }

  // 엔터로 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          className="input"
          placeholder={`${label} 입력`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={add} className="btn btn-primary whitespace-nowrap">
          {label} 추가
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((w) => (
          <li key={w.id} className="card p-4 flex items-center justify-between">
            <span className="truncate">{w.content}</span>
            <button onClick={() => remove(w.id)} className="btn btn-secondary">
              삭제
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-graytone-ash">등록된 항목이 없습니다.</li>
        )}
      </ul>
    </div>
  )
}
