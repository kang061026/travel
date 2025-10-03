'use client'
import { TAB_LABELS, TabKey } from '@/lib/utils'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export default function HeaderTabs({
  current,
  onChange
}: {
  current: TabKey
  onChange: (k: TabKey) => void
}) {
  const [open, setOpen] = useState(false)

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* 왼쪽 상단 햄버거 버튼 (전역 고정) */}
      <div className="fixed top-3 left-3 z-40">
        <button
          aria-label="탭 열기"
          onClick={() => setOpen(true)}
          className="h-10 w-10 rounded-xl2 border border-ink-slate/20 bg-base-white shadow-soft hover:bg-graytone-cloud flex items-center justify-center"
        >
          {/* 햄버거 아이콘 (3줄) */}
          <span className="sr-only">메뉴</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-ink-deep rounded"></span>
            <span className="block h-0.5 w-5 bg-ink-deep rounded"></span>
            <span className="block h-0.5 w-5 bg-ink-deep rounded"></span>
          </div>
        </button>
      </div>

      {/* 드로어 & 오버레이 */}
      {open && (
        <>
          {/* 배경 오버레이 클릭 시 닫기 */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />
          {/* 사이드 드로어 */}
          <aside className="fixed z-50 left-0 top-0 h-dvh w-72 max-w-[80vw] bg-base-white border-r border-ink-slate/10 shadow-soft">
            <div className="p-4 flex items-center justify-between border-b border-ink-slate/10">
              <div className="font-semibold">탭 이동</div>
              <button
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-xl2 border border-ink-slate/20 hover:bg-graytone-cloud"
              >
                닫기
              </button>
            </div>

            <nav className="p-2">
              <ul className="space-y-1">
                {TAB_LABELS.map((t) => {
                  const active = current === t.key
                  return (
                    <li key={t.key}>
                      <button
                        onClick={() => {
                          onChange(t.key)
                          setOpen(false)
                        }}
                        className={clsx(
                          'w-full text-left px-3 py-2.5 rounded-xl2 border transition-colors',
                          active
                            ? 'bg-graytone-cloud border-ink-deep text-ink-deep font-semibold'
                            : 'border-transparent text-ink-deep hover:bg-graytone-cloud'
                        )}
                      >
                        {t.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  )
}
