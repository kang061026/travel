'use client'
import Shell from './_components/Shell'
import HeaderTabs from './_components/HeaderTabs'
import { TAB_LABELS, TabKey } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import ScheduleList from './_components/ScheduleList'
import Wishlist from './_components/Wishlist'

const DEFAULT_TAB: TabKey = 'day1'
const isValidTab = (v: string | null): v is TabKey =>
  !!v && (TAB_LABELS as any).some((t: any) => t.key === v)

export default function Page() {
  const [tab, setTab] = useState<TabKey>(DEFAULT_TAB)

  // 초기 로드 시 URL ?tab=... 또는 localStorage에서 복구
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromQuery = params.get('tab')
    if (isValidTab(fromQuery)) {
      setTab(fromQuery)
      localStorage.setItem('tripplanner_tab', fromQuery)
      return
    }
    const fromStorage = localStorage.getItem('tripplanner_tab')
    if (isValidTab(fromStorage)) {
      setTab(fromStorage)
      // URL도 정리
      const p = new URLSearchParams(window.location.search)
      p.set('tab', fromStorage)
      history.replaceState(null, '', `?${p.toString()}`)
    } else {
      // 기본값을 URL에 기록
      const p = new URLSearchParams(window.location.search)
      p.set('tab', DEFAULT_TAB)
      history.replaceState(null, '', `?${p.toString()}`)
      localStorage.setItem('tripplanner_tab', DEFAULT_TAB)
    }
  }, [])

  // 탭 변경 시 상태 + URL + localStorage 동기화
  const onChangeTab = (k: TabKey) => {
    setTab(k)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', k)
    history.replaceState(null, '', `?${params.toString()}`)
    localStorage.setItem('tripplanner_tab', k)
  }

  const isScheduleTab = useMemo(
    () =>
      tab === 'day1' ||
      tab === 'day2' ||
      tab === 'day4' ||
      tab === 'personal_arum' ||
      tab === 'personal_seunghyun' ||
      tab === 'personal_choi',
    [tab]
  )

  return (
    <Shell>
      <HeaderTabs current={tab} onChange={onChangeTab} />
      <div className="card p-4">
        {isScheduleTab && <ScheduleList tab={tab} />}
        {tab === 'food' && <Wishlist tab="food" />}
        {tab === 'place' && <Wishlist tab="place" />}
      </div>
    </Shell>
  )
}
