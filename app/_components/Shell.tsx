export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-sm md:max-w-3xl lg:max-w-4xl px-4">
      {/* 상단 고정 햄버거 높이 + safe area 만큼 여백 */}
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 64px)' }} />
      {children}
    </div>
  )
}
