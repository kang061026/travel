'use client'
import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabaseClient'
import { formatKRW, TabKey, TAB_LABELS } from '@/lib/utils'
import AddScheduleModal from './AddScheduleModal'
import EditScheduleModal from './EditScheduleModal'

type Row = {
  id: string
  tab_name: TabKey
  title: string
  time_range: string | null
  amount: number | null
  created_at: string
}

export default function ScheduleList({ tab }: { tab: TabKey }) {
  const supabase = createSupabaseBrowser()
  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [editItem, setEditItem] = useState<Row | null>(null)

  const tabLabel = useMemo(() => {
    return TAB_LABELS.find((t) => t.key === tab)?.label ?? '일정'
  }, [tab])

  // 초기 로드
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('schedules')
        .select('*')
        .eq('tab_name', tab)
        .order('time_range', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true })
      if (mounted) {
        setItems((data as Row[]) || [])
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [tab])

  // 실시간 구독
  useEffect(() => {
    const ch = supabase
      .channel(`sch-${tab}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules', filter: `tab_name=eq.${tab}` },
        (payload) => {
          setItems((cur) => {
            const type = payload.eventType
            if (type === 'INSERT') return [...cur, payload.new as Row]
            if (type === 'UPDATE') return cur.map(r => r.id === (payload.new as Row).id ? (payload.new as Row) : r)
            if (type === 'DELETE') return cur.filter(r => r.id !== (payload.old as Row).id)
            return cur
          })
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [tab])

  // 총 금액 계산
  const total = useMemo(
    () => items.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [items]
  )

  // 시간순 정렬
  const sorted = useMemo(() => {
    const parse = (s?: string | null) => {
      if (!s) return 999999
      const m = s.match(/^(\d{2}):(\d{2})/)
      if (!m) return 999999
      return Number(m[1]) * 60 + Number(m[2])
    }
    return [...items].sort((a, b) => parse(a.time_range) - parse(b.time_range))
  }, [items])

  // 일정 삭제
  const remove = async (id: string) => {
    await supabase.from('schedules').delete().eq('id', id)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{tabLabel}</h2>
        <button className="btn btn-primary" onClick={() => setOpenAdd(true)}>일정 추가</button>
      </div>

      {loading ? (
        <div className="text-sm text-graytone-ash">불러오는 중…</div>
      ) : (
        <div className="overflow-x-auto">
          {/* table-layout을 auto로 강제하여 열 폭이 자연스럽게 분배되도록 */}
          <table className="w-full border-collapse text-sm" style={{ tableLayout: 'auto' }}>
            {/* 모바일에서 열 폭을 안정적으로 유지하기 위한 colgroup */}
            <colgroup>
              <col style={{ width: '30%' }} />  {/* 시간 */}
              <col style={{ width: '40%' }} />  {/* 내용 */}
              <col style={{ width: '18%' }} />  {/* 금액 */}
              <col style={{ width: '12%' }} />  {/* 수정 */}
            </colgroup>
            <thead>
              <tr className="border-b border-graytone-cloud text-left">
                <th className="py-2 px-3 whitespace-nowrap">시간</th>
                {/* 내용은 가로로 유지하고, 너무 길면 … 처리 */}
                <th className="py-2 px-3 whitespace-nowrap">내용</th>
                <th className="py-2 px-3 whitespace-nowrap text-right">금액</th>
                <th className="py-2 px-3 text-center whitespace-nowrap">수정</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id} className="border-b border-graytone-cloud align-middle">
                  <td className="py-2 px-3 text-graytone-ash whitespace-nowrap">
                    {r.time_range || '-'}
                  </td>
                  <td className="py-2 px-3">
                    {/* 한 줄 우선 표시 + 너무 길면 말줄임, 줄바꿈은 필요 시만 */}
                    <div className="truncate">{r.title}</div>
                  </td>
                  <td className="py-2 px-3 text-right whitespace-nowrap">
                    {r.amount != null ? formatKRW(Number(r.amount)) : '-'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditItem(r)} className="btn btn-secondary">수정</button>
                      <button onClick={() => remove(r.id)} className="btn btn-secondary">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-graytone-ash">
                    등록된 일정이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <div className="px-4 py-3 rounded-full bg-ink-deep text-base-white shadow-soft">
          총 예산 {formatKRW(total)}
        </div>
      </div>

      <AddScheduleModal open={openAdd} onClose={()=>setOpenAdd(false)} tab={tab} />
      <EditScheduleModal open={!!editItem} onClose={()=>setEditItem(null)} item={editItem} />
    </div>
  )
}
